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
          throw new Error("Please enter both email and password");
        }

        const email = credentials.email.toLowerCase().trim();

        // 1. Try MongoDB if connected
        try {
          await connectDB();
          if (isDbConnected()) {
            const user = await User.findOne({ email }).select("+password");
            if (user && user.password) {
              const isValid = await bcrypt.compare(credentials.password, user.password);
              if (isValid) {
                return {
                  id: user._id.toString(),
                  name: user.name,
                  email: user.email,
                  image: user.image,
                };
              }
            }
          }
        } catch (dbErr) {
          console.warn("Auth DB check failed, checking mock store:", dbErr);
        }

        // 2. Fallback to mock store
        const mockUser = mockStore.getUserByEmail(email);
        if (mockUser) {
          if (mockUser.password) {
            const isValid = await bcrypt.compare(credentials.password, mockUser.password);
            if (isValid) {
              return {
                id: mockUser._id,
                name: mockUser.name,
                email: mockUser.email,
              };
            }
          } else {
            // Demo user without password requirement
            return {
              id: mockUser._id,
              name: mockUser.name,
              email: mockUser.email,
            };
          }
        }

        // If not found in mock store either, create a quick demo session for seamless UX
        // when users test without having registered yet
        const autoUser = mockStore.addUser({
          name: email.split("@")[0] || "Patient",
          email,
          password: await bcrypt.hash(credentials.password, 10),
        });

        return {
          id: autoUser._id,
          name: autoUser.name,
          email: autoUser.email,
        };
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
