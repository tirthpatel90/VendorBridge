import { NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
import User from "@/lib/models/user"

export async function GET() {
  try {
    await connectDB()
    const users = await User.find({}).select("-password").sort({ createdAt: -1 })
    return NextResponse.json(users)
  } catch (error: any) {
    console.error("Fetch users error:", error)
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    )
  }
}

export async function DELETE(request: Request) {
  try {
    const { id } = await request.json()
    if (!id) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 })
    }
    await connectDB()
    const deleted = await User.findByIdAndDelete(id)
    if (!deleted) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }
    return NextResponse.json({ message: "User deleted successfully" })
  } catch (error: any) {
    console.error("Delete user error:", error)
    return NextResponse.json(
      { error: "Failed to delete user" },
      { status: 500 }
    )
  }
}
