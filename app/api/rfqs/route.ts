import { NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
import RfqModel from "@/lib/models/rfq"

export async function GET() {
  try {
    await connectDB()
    const rfqs = await RfqModel.find({}).sort({ createdAt: -1 })
    return NextResponse.json(rfqs)
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to fetch RFQs" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    await connectDB()
    const rfq = await RfqModel.create(body)
    return NextResponse.json(rfq, { status: 201 })
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to create RFQ" }, { status: 500 })
  }
}
