import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { shouldUseMockDb } from "@/lib/mock-db";

export async function GET() {
  try {
    // Test database connection by counting users
    const userCount = await db.user.count();
    const orgCount = await db.organization.count();
    const projectCount = await db.project.count();
    const taskCount = await db.task.count();
    
    return NextResponse.json({ 
      status: "healthy",
      database: shouldUseMockDb() ? "mock (development)" : "connected",
      counts: {
        users: userCount,
        organizations: orgCount,
        projects: projectCount,
        tasks: taskCount
      },
      message: shouldUseMockDb() 
        ? "Using mock database for development. Run 'npm run setup:postgres' to configure PostgreSQL." 
        : "PostgreSQL database connected successfully."
    });
  } catch (error) {
    console.error("Database connection error:", error);
    return NextResponse.json({ 
      status: "error",
      database: "disconnected",
      error: error instanceof Error ? error.message : "Unknown error",
      message: "Database connection failed. Please check your PostgreSQL configuration."
    }, { status: 500 });
  }
}