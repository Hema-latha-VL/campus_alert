import mongoose, { Document, Schema } from 'mongoose';

export type UserRole = 'student' | 'advisor' | 'admin';
export type UserStatus = 'pending' | 'approved' | 'active';

export interface IUser extends Document {
  firstName: string;
  lastName: string;
  loginName: string;
  email: string;
  department: string;
  advisorName?: string;
  advisorLoginName?: string;
  role: UserRole;
  status: UserStatus;
  phoneNumber: string;
  passwordHash: string;
  notificationPreferences: {
    email: boolean;
    push: boolean;
    urgent: boolean;
    eventReminders: boolean;
  };
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    loginName: { type: String, required: true, unique: true, trim: true, index: true },
    email: { type: String, required: true, unique: true, trim: true, lowercase: true, index: true },
    department: { type: String, required: true, trim: true },
    advisorName: { type: String, trim: true },
    advisorLoginName: { type: String, trim: true, index: true },
    role: { type: String, required: true, enum: ['student', 'advisor', 'admin'], index: true },
    status: { type: String, required: true, enum: ['pending', 'approved', 'active'], index: true },
    phoneNumber: { type: String, required: true, trim: true },
    passwordHash: { type: String, required: true },
    notificationPreferences: {
      email: { type: Boolean, default: false },
      push: { type: Boolean, default: true },
      urgent: { type: Boolean, default: true },
      eventReminders: { type: Boolean, default: false },
    },
  },
  { timestamps: true }
);

export const User = mongoose.model<IUser>('User', userSchema);
