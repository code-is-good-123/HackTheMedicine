import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { connectDB, isDbConnected } from "@/lib/db";
import User from "@/models/User";
import { mockStore } from "@/lib/mockStore";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "name@example.com" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Please enter both email and password.");
        }

        const email = credentials.email.toLowerCase().trim();
        const enteredPassword = credentials.password;

        // 1. Try MongoDB if connected
        try {
          await connectDB();
          if (isDbConnected()) {
            const user = await User.findOne({ email }).select("+password");
            if (user) {
              if (!user.password) {
                return null;
              }
              const isMatch = await bcrypt.compare(enteredPassword, user.password);
              if (!isMatch) {
                // Explicitly return null or throw so NextAuth triggers an error
                return null;
              }
              return {
                id: user._id.toString(),
                name: user.name,
                email: user.email,
                image: user.image,
              };
            }
          }
        } catch (dbErr) {
          console.warn("MongoDB auth check failed, checking mock store:", dbErr);
        }

        // 2. Fallback to mock store
        const mockUser = mockStore.getUserByEmail(email);
        if (mockUser) {
          if (mockUser.password) {
            const isMatch = await bcrypt.compare(enteredPassword, mockUser.password);
            if (!isMatch) {
              return null;
            }
            return {
              id: mockUser._id,
              name: mockUser.name,
              email: mockUser.email,
            };
          } else {
            // Default demo account
            return {
              id: mockUser._id,
              name: mockUser.name,
              email: mockUser.email,
            };
          }
        }

        // 3. User does not exist — do not authenticate
        return null;
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token) {
        (session.user as any).id = token.id as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET || "hackthemedicine-secret-key-fallback",
};
