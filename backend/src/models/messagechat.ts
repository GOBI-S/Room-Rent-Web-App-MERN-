import mongoose, { Schema } from "mongoose";

const ChatSchema = new Schema({
  sender: {
    type: String, // Sender's ID
    required: true,
  },
  senderMessages: [
    {
      message: {
        type: String,
      },
      timestamp: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  receiver: {
    type: String, // Receiver's ID
    required: true,
  },
  receiverMessages: [
    {
      message: {
        type: String,
      },
      timestamp: {
        type: Date,
        default: Date.now,
      },
    },
  ],
});

const ChatHistory = mongoose.model("chatschem", ChatSchema);

export default ChatHistory;

