import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB, isDbConnected } from "@/lib/db";
import User from "@/models/User";
import { mockStore } from "@/lib/mockStore";

export async function POST(req: NextRequest) {
  try {
    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Name, email, and password are required." },
        { status: 400 }
      );
    }

    const cleanEmail = email.toLowerCase().trim();

    // 1. Check if database is accessible
    try {
      await connectDB();
      if (isDbConnected()) {
        const existingUser = await User.findOne({ email: cleanEmail });
        if (existingUser) {
          return NextResponse.json(
            { error: "User with this email already exists." },
            { status: 409 }
          );
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await User.create({
          name,
          email: cleanEmail,
          password: hashedPassword,
        });

        // Also sync to mock store
        mockStore.addUser({
          _id: newUser._id.toString(),
          name: newUser.name,
          email: newUser.email,
          password: hashedPassword,
        });

        return NextResponse.json(
          {
            success: true,
            user: { id: newUser._id, name: newUser.name, email: newUser.email },
          },
          { status: 201 }
        );
      }
    } catch (dbErr) {
      console.warn("MongoDB registration query failed, using in-memory store:", dbErr);
    }

    // 2. In-memory fallback
    const existingMock = mockStore.getUserByEmail(cleanEmail);
    if (existingMock) {
      return NextResponse.json(
        { error: "User with this email already exists." },
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const mockUser = mockStore.addUser({
      name,
      email: cleanEmail,
      password: hashedPassword,
    });

    return NextResponse.json(
      {
        success: true,
        user: { id: mockUser._id, name: mockUser.name, email: mockUser.email },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Failed to register user." },
      { status: 500 }
    );
  }
}
