import mongoose, { Schema, Document, Model } from 'mongoose';

// TypeScript interface for the document
export interface IUser extends Document {
  email: string;
  name?: string;
  phoneNumber?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Define the schema
const UserSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    name: {
      type: String,
      trim: true,
    },
    phoneNumber: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt
  }
);

// Prevent model recompilation in development (Next.js hot reload)
const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

export default User;
