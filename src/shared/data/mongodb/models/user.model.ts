import mongoose, { type Document, Schema } from "mongoose"
import { UserRole } from "../../../enums";
import { type User } from "../../../../modules/user/domain/entities";

export interface UserDocument extends Document, Omit<User, "id"> {
  // id: string; // Mongoose automatically adds an _id field, but we can use it as id
}

const userSchema = new Schema<UserDocument>(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: [2, "Name must have at least 2 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, "Please enter a valid email address"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [8, "Password must have at least 8 characters"],
    },
    roles: {
      type: [String],
      enum: Object.values(UserRole),
      default: [UserRole.USER]
    },
    isActive: {
      type: Boolean,
      default: true
    },
  },
  {
    timestamps: true, 
  },
)

export const UserModel = mongoose.model<UserDocument>("User", userSchema);
