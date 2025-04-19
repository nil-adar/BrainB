import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema({
  senderId: { type: String, required: true },
  receiverId: { type: String, required: true },
  content: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  isRead: { type: Boolean, default: false },
  senderRole: { type: String, enum: ["teacher", "parent"], required: true }
});

export const MessageModel = mongoose.model("Message", MessageSchema);
