import { Schema, model, type Document, type Types } from 'mongoose';

export interface IUser extends Document {
  _id: Types.ObjectId;
  name: string;
  email: string;
  role: 'trainee' | 'admin';
  createdAt: Date;
}

const userSchema = new Schema<IUser>({
  name: { type: String, required: true, trim: true, maxlength: 120 },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Invalid email address'],
  },
  role: { type: String, enum: ['trainee', 'admin'], default: 'trainee' },
  createdAt: { type: Date, default: Date.now },
});

export const User = model<IUser>('User', userSchema);
