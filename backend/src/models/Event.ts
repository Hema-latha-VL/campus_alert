import mongoose, { Document, Schema } from 'mongoose';

export type EventType = 'event' | 'test' | 'placement';

export interface IEvent extends Document {
  name: string;
  eventType: EventType;
  date: Date;
  time: string; // HH:MM format
  imageUrl?: string;
  coordinator: string;
  capacity: number;
  department: string;
  description: string;
  views: number;
  createdBy: {
    _id: string;
    loginName: string;
    firstName: string;
    lastName: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const eventSchema = new Schema<IEvent>(
  {
    name: { type: String, required: true, trim: true },
    eventType: { 
      type: String, 
      required: true, 
      enum: ['event', 'test', 'placement'],
      index: true 
    },
    date: { type: Date, required: true, index: true },
    time: { type: String, required: true }, // HH:MM format
    imageUrl: { type: String, trim: true },
    coordinator: { type: String, required: true, trim: true },
    capacity: { type: Number, required: true, min: 1 },
    department: { type: String, required: true, trim: true, index: true },
    description: { type: String, required: true, trim: true },
    views: { type: Number, default: 0, min: 0 },
    createdBy: {
      _id: { type: String, required: true },
      loginName: { type: String, required: true },
      firstName: { type: String, required: true },
      lastName: { type: String, required: true },
    },
  },
  { timestamps: true }
);

export const Event = mongoose.model<IEvent>('Event', eventSchema);
