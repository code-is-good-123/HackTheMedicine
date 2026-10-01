import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { mockStore } from "@/lib/mockStore";
import { connectDB, isDbConnected } from "@/lib/db";
import Schedule from "@/models/Schedule";
import DoseLog from "@/models/DoseLog";
import User from "@/models/User";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const userId = (session?.user as any)?.id || "demo_user_1";

    const todayStr = new Date().toISOString().split("T")[0];
    const now = new Date();
    const currentHour = now.getHours();
    const currentMin = now.getMinutes();
    const currentTotalMins = currentHour * 60 + currentMin;

    let schedules: any[] = [];
    let logs: any[] = [];

    try {
      await connectDB();
      if (isDbConnected()) {
        schedules = await Schedule.find({ userId, active: true }).populate("medicationId");
        logs = await DoseLog.find({ userId, date: todayStr }).populate("medicationId");
      }
    } catch {
      // Fallback
    }

    if (schedules.length === 0) {
      schedules = mockStore.getSchedules(userId);
      logs = mockStore.getDoseLogs(todayStr, userId);
    }

    const alerts: any[] = [];

    for (const sched of schedules) {
      const medName = sched.medicationId?.name || "Medication";
      const doses = sched.doses || [];

      for (const dose of doses) {
        const [h, m] = (dose.time || "00:00").split(":").map(Number);
        const doseTotalMins = h * 60 + m;

        // Check if logged
        const logged = logs.find(
          (l) =>
            (l.scheduleId?.toString() === sched._id?.toString() ||
              l.scheduleId === sched._id) &&
            l.scheduledTime === dose.time
        );

        if (!logged) {
          // If past by more than 15 minutes, it's overdue
          if (currentTotalMins > doseTotalMins + 15) {
            const overdueMins = currentTotalMins - doseTotalMins;
            alerts.push({
              id: `overdue_${sched._id}_${dose.time}`,
              type: "overdue",
              medicationId: sched.medicationId?._id || sched.medicationId,
              medicationName: medName,
              dosage: dose.dosage,
              time: dose.time,
              overdueMinutes: overdueMins,
              message: `Overdue: ${medName} was scheduled for ${dose.time}`,
            });
          }
        }
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        alerts,
        totalAlerts: alerts.length,
      },
    });
  } catch (error) {
    console.error("GET notifications error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch notifications" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const userId = (session?.user as any)?.id || "demo_user_1";
    const body = await req.json();

    const { token, action, testDose } = body;

    // Action 1: Register Push Token
    if (token) {
      try {
        await connectDB();
        if (isDbConnected()) {
          await User.findByIdAndUpdate(userId, {
            $addToSet: { fcmTokens: token },
          });
        }
      } catch (err) {
        console.warn("Could not save push token to DB:", err);
      }

      return NextResponse.json({
        success: true,
        message: "Push notification subscription registered successfully.",
      });
    }

    // Action 2: Send test push notification trigger
    if (action === "test") {
      return NextResponse.json({
        success: true,
        notification: {
          title: "⏰ Dose Reminder: Amoxicillin 500mg",
          body: "It is time for your scheduled afternoon dose (1 Capsule). Take with water after lunch.",
          icon: "/logo.png",
          badge: "/logo.png",
          tag: "dose-alert-test",
          timestamp: Date.now(),
        },
      });
    }

    return NextResponse.json({
      success: true,
      message: "Notification event processed",
    });
  } catch (error) {
    console.error("POST notifications error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to process notification request" },
      { status: 500 }
    );
  }
}
