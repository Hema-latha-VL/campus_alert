import mongoose, { Document, Schema } from 'mongoose';

export interface IFeedback extends Document {
  studentId: string;
  studentName: string;
  studentLoginName: string;
  studentEmail: string;
  department: string;
  advisorLoginName: string;
  message: string;
  status: 'unread' | 'read';
  createdAt: Date;
  updatedAt: Date;
}

const feedbackSchema = new Schema<IFeedback>(
  {
    studentId: { type: String, required: true, index: true },
    studentName: { type: String, required: true, trim: true },
    studentLoginName: { type: String, required: true, trim: true, index: true },
    studentEmail: { type: String, required: true, trim: true, lowercase: true },
    department: { type: String, required: true, trim: true, index: true },
    advisorLoginName: { type: String, required: true, trim: true, index: true },
    message: { type: String, required: true, trim: true },
    status: { type: String, required: true, enum: ['unread', 'read'], default: 'unread', index: true },
  },
  { timestamps: true }
);

// Compound index for advisor and status
feedbackSchema.index({ advisorLoginName: 1, status: 1 });

export const Feedback = mongoose.model<IFeedback>('Feedback', feedbackSchema);
