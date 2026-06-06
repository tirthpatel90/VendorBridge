import { NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
import User from "@/lib/models/user"

export async function POST(req: NextRequest) {
  try {
    await connectDB()

    const body = await req.json()
    const { firstName, lastName, email, password, role, phone, country, info } = body

    // Validate required fields
    if (!firstName || !lastName || !email || !password || !role) {
      return NextResponse.json(
        { success: false, message: "All required fields must be filled" },
        { status: 400 }
      )
    }

    // Check valid role
    const validRoles = ["admin", "officer", "vendor", "manager"]
    if (!validRoles.includes(role)) {
      return NextResponse.json(
        { success: false, message: "Invalid role selected" },
        { status: 400 }
      )
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() })
    if (existingUser) {
      return NextResponse.json(
        { success: false, message: "This email is already registered. Please sign in." },
        { status: 409 }
      )
    }

    // Create user
    const user = await User.create({
      firstName,
      lastName,
      email: email.toLowerCase(),
      password,
      role,
      phone: phone || "",
      country: country || "",
      info: info || "",
    })

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
    console.error("Register error:", error)
    return NextResponse.json(
      { success: false, message: "Server error. Please try again." },
      { status: 500 }
    )
  }
}
