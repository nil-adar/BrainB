
import mongoose, { Schema, Document } from 'mongoose';
import { Message as MessageType } from '@/types/school';

// Interface for the MongoDB document
export interface MessageDocument extends Omit<MessageType, 'id'>, Document {
  // The _id from mongoose will replace the id field
}

const MessageSchema = new Schema(
  {
    senderId: { type: String, required: true },
    receiverId: { type: String, required: true },
    content: { type: String, required: true },
    isRead: { type: Boolean, default: false },
    senderRole: { 
      type: String, 
      enum: ['teacher', 'parent'],
      required: true
    },
  },
  { timestamps: { createdAt: 'timestamp' } }
);

// Convert MongoDB document to Message type on response
MessageSchema.set('toJSON', {
  transform: (_doc: any, ret: any) => {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    return ret;
  }
});

export const MessageModel = mongoose.model<MessageDocument>('Message', MessageSchema);
