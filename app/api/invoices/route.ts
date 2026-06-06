import { NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
import InvoiceModel from "@/lib/models/invoice"

export async function GET() {
  try {
    await connectDB()
    const invoices = await InvoiceModel.find({}).sort({ createdAt: -1 })
    return NextResponse.json(invoices)
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to fetch invoices" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    await connectDB()
    const invoice = await InvoiceModel.create(body)
    return NextResponse.json(invoice, { status: 201 })
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to create invoice" }, { status: 500 })
  }
}

export async function PATCH(request: Request) {
  try {
    const { id, status } = await request.json()
    await connectDB()
    const invoice = await InvoiceModel.findByIdAndUpdate(id, { status }, { new: true })
    return NextResponse.json(invoice)
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to update invoice" }, { status: 500 })
  }
}
