import mongoose, { Schema, Document, Model } from "mongoose"

export interface IVendor extends Document {
  name: string
  category: string
  gst: string
  contactPerson: string
  email: string
  phone: string
  address: string
  status: "Active" | "Inactive" | "Pending"
  rating: number
  bank: { name: string; account: string; ifsc: string }
  pos: { id: string; date: string; amount: number; status: string }[]
  createdAt: Date
}

const VendorSchema = new Schema<IVendor>(
  {
    name: { type: String, required: true, trim: true },
    category: { type: String, required: true },
    gst: { type: String, default: "" },
    contactPerson: { type: String, default: "" },
    email: { type: String, required: true, trim: true },
    phone: { type: String, default: "" },
    address: { type: String, default: "" },
    status: { type: String, enum: ["Active", "Inactive", "Pending"], default: "Pending" },
    rating: { type: Number, default: 0 },
    bank: {
      name: { type: String, default: "N/A" },
      account: { type: String, default: "N/A" },
      ifsc: { type: String, default: "N/A" },
    },
    pos: [
      {
        id: String,
        date: String,
        amount: Number,
        status: String,
      },
    ],
  },
  { timestamps: true }
)

if (process.env.NODE_ENV !== "production") {
  delete mongoose.models.Vendor
}
const Vendor: Model<IVendor> = mongoose.models.Vendor || mongoose.model<IVendor>("Vendor", VendorSchema)
export default Vendor
