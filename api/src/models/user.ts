import mongoose from "mongoose";
import bcrypt from "bcryptjs";

export type userType = {
  _id: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  verified: boolean;
};

const userSchema = new mongoose.Schema<userType>({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  verified: { type: Boolean, default: false, required: true },
});

// middleware for mongo db
userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 9);
  }

  next();
});

const User = mongoose.model<userType>("User", userSchema);

export default User;
