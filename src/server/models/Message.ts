import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IMessage extends Document {
  senderId: mongoose.Types.ObjectId;
  receiverId: mongoose.Types.ObjectId;
  studentId: mongoose.Types.ObjectId;
  content: string;
  timestamp: Date;
  isRead: boolean;
  senderRole: 'teacher' | 'parent';
}

// 1. אנוטציה מפורשת על המשתנה
const MessageSchema: Schema<IMessage> = new mongoose.Schema(
  {
    senderId:   { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    receiverId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    studentId:  { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    content:    { type: String, required: true },
    timestamp:  { type: Date, default: Date.now },
    isRead:     { type: Boolean, default: false },
    senderRole: { type: String, enum: ["teacher","parent"], required: true }
  },
  { timestamps: false } // 
);


MessageSchema.index({ studentId: 1, senderId: 1, receiverId: 1 });

// 3. יצוא המודל
export const MessageModel: Model<IMessage> = mongoose.model<IMessage>("Message", MessageSchema);
