import { NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
import QuotationModel from "@/lib/models/quotation"

export async function GET() {
  try {
    await connectDB()
    const quotations = await QuotationModel.find({}).sort({ createdAt: -1 })
    return NextResponse.json(quotations)
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to fetch quotations" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    await connectDB()
    const quotation = await QuotationModel.create(body)
    return NextResponse.json(quotation, { status: 201 })
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to create quotation" }, { status: 500 })
  }
}
