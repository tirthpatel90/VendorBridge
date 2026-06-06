import { NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
import User from "@/lib/models/user"

export async function POST(req: NextRequest) {
  try {
    await connectDB()

    const body = await req.json()
    const { email, password } = body

    // Validate
    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: "Email and password are required" },
        { status: 400 }
      )
    }

    // Find user
    const user = await User.findOne({ email: email.toLowerCase() })
    if (!user) {
      return NextResponse.json(
        { success: false, message: "No account found with this email. Please register first." },
        { status: 404 }
      )
    }

    // Compare password
    const isMatch = await user.comparePassword(password)
    if (!isMatch) {
      return NextResponse.json(
        { success: false, message: "Incorrect password. Please try again." },
        { status: 401 }
      )
    }

    // Role labels
    const roleLabels: Record<string, string> = {
      admin: "System Admin",
      officer: "Procurement Officer",
      vendor: "Vendor",
      manager: "Procurement Manager",
    }

    const fullName = `${user.firstName} ${user.lastName}`
    const initials = `${user.firstName[0]}${user.lastName[0]}`.toUpperCase()

    return NextResponse.json({
      success: true,
      user: {
        name: fullName,
        email: user.email,
        role: user.role,
        roleLabel: roleLabels[user.role] || user.role,
        initials,
        phone: user.phone,
        country: user.country,
        info: user.info,
      },
    })
  } catch (error: any) {
    console.error("Login error:", error)
    return NextResponse.json(
      { success: false, message: "Server error. Please try again." },
      { status: 500 }
    )
  }
}
