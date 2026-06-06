import mongoose, { Schema, Document, Model } from "mongoose"
import bcrypt from "bcryptjs"

export interface IUser extends Document {
  firstName: string
  lastName: string
  email: string
  password: string
  role: "admin" | "officer" | "vendor" | "manager"
  phone?: string
  country?: string
  info?: string
  createdAt: Date
  comparePassword(candidatePassword: string): Promise<boolean>
}

const UserSchema = new Schema<IUser>(
  {
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    role: { type: String, required: true, enum: ["admin", "officer", "vendor", "manager"] },
    phone: { type: String, default: "" },
    country: { type: String, default: "" },
    info: { type: String, default: "" },
  },
  { timestamps: true }
)

// Hash password before saving
UserSchema.pre("save", async function () {
  if (!this.isModified("password")) return
  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, salt)
})

// Compare password method
UserSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password)
}

// Prevent model recompilation in dev (hot reload)
if (process.env.NODE_ENV !== "production") {
  delete mongoose.models.User
}
const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>("User", UserSchema)

export default User
