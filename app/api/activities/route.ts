import { NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
import ActivityModel from "@/lib/models/activity"

export async function GET() {
  try {
    await connectDB()
    const activities = await ActivityModel.find({}).sort({ createdAt: -1 }).limit(50)
    return NextResponse.json(activities)
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to fetch activities" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    await connectDB()
    const activity = await ActivityModel.create(body)
    return NextResponse.json(activity, { status: 201 })
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to create activity" }, { status: 500 })
  }
}
