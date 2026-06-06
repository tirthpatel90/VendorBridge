import { NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
import PurchaseOrderModel from "@/lib/models/purchaseOrder"

export async function GET() {
  try {
    await connectDB()
    const pos = await PurchaseOrderModel.find({}).sort({ createdAt: -1 })
    return NextResponse.json(pos)
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to fetch purchase orders" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    await connectDB()
    const po = await PurchaseOrderModel.create(body)
    return NextResponse.json(po, { status: 201 })
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to create purchase order" }, { status: 500 })
  }
}
