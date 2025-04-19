import mongoose, { type Document, Schema } from "mongoose"
import { type User } from "../../../../../../domain/entities";
import { UserRole } from "../../../../../../domain/enums";

export interface UserDocument extends Document, Omit<User, "id"> {
  // El _id de MongoDB se mapea a id en la entidad
}

const userSchema = new Schema<UserDocument>(
  {
    name: {
      type: String,
      required: [true, "El nombre es requerido"],
      trim: true,
      minlength: [2, "El nombre debe tener al menos 2 caracteres"],
    },
    email: {
      type: String,
      required: [true, "El email es requerido"],
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, "Por favor ingresa un email válido"],
    },
    password: {
      type: String,
      required: [true, "La contraseña es requerida"],
      minlength: [8, "La contraseña debe tener al menos 8 caracteres"],
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
