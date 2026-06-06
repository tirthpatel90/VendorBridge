import { NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
import VendorModel from "@/lib/models/vendor"

export async function GET() {
  try {
    await connectDB()
    const vendors = await VendorModel.find({}).sort({ createdAt: -1 })
    return NextResponse.json(vendors)
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to fetch vendors" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    await connectDB()
    const vendor = await VendorModel.create({ ...body, status: "Pending", rating: 0, pos: [] })
    return NextResponse.json(vendor, { status: 201 })
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to create vendor" }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const { id } = await request.json()
    await connectDB()
    await VendorModel.findByIdAndDelete(id)
    return NextResponse.json({ message: "Vendor deleted" })
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to delete vendor" }, { status: 500 })
  }
}
