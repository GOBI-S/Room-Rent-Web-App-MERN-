import express from "express";
import http from "http";
import mongoose from "mongoose";
import { Server } from "socket.io";
import { UserSignupModel } from "../models/loginshema"; // Ensure this points to the correct user model
import { CreateRoomModel } from "../models/createroom"; // Ensure this points to the room model
import messagechat from "../models/messagechat";
import Chatlistschema from "../models/bookedshema";

const userSocketMap: Map<string, string> = new Map(); // Map to store user-to-socket associations

export function initializeSocket(server: http.Server) {
  const io = new Server(server, {
    cors: {
      origin: "http://localhost:5173", // Frontend URL (Ensure this is correct)
      methods: ["GET", "POST"], // Allowed HTTP methods
      allowedHeaders: ["Content-Type"], // Optional: Add any headers you need
    },
  });

  io.on("connection", (socket) => {
    console.log(`A user connected: ${socket.id}`);

    // Register user with their userId
    socket.on("registerUser", async (userId: string) => {
      const user = await UserSignupModel.findOne({ _id: userId });
      if (!userId) {
        console.error("User ID is missing during registration.");
        return;
      }
      userSocketMap.set(userId, socket.id);
      console.log(
        `${user?.email}, User registered: UserID=${userId}, SocketID=${socket.id}`
      );
    });
    socket.on("sendMessage", async (data) => {
      const { senderId, message, ReceiverRoomId } = data;
    
      try {
        // Find the room and the owner
        const room = await CreateRoomModel.findById(ReceiverRoomId);
        console.log(room)
        if (!room) {
          console.error(`Room with ID=${ReceiverRoomId} not found.`);
          return;
        }
        
        const ownerId= await UserSignupModel.findOne({ email: room.Email });
        const user = await UserSignupModel.findOne({ _id: senderId });
        const ownerEmail:any = room.Email; // Get the owner's user ID
        const checkchatshema=await messagechat.findOne({sender:ownerEmail,receiver:ownerEmail})
        const checkchatlist=await Chatlistschema.findOne({userId:ownerId?.email})
        if(!checkchatlist){
          const chatlistschema=new Chatlistschema({userId:ownerId?.email,name:ownerId?.name})
            await chatlistschema.save()  
        }
        if(!checkchatshema){
          const newchatschema=new messagechat({sender:user?.email,receiver:ownerEmail})
          await newchatschema.save()  
        }
        const receiverSocketId = userSocketMap.get(ownerId?.id); // Get the owner's socket ID
        console.log(userSocketMap)
        if (receiverSocketId) {
          // Send the message to the room owner
          io.to(receiverSocketId).emit("receiveMessage", {
            sender: senderId,
            message,
          });
          console.log(`Message sent to Room Owner (OwnerID=${ownerEmail}).`);
        } else {
          console.error(`Room Owner (OwnerID=${ownerEmail}) is not online.`);
        }
      } catch (error) {
        console.error("Error handling sendMessage event:", error);
      }
    });
    
    // Handle user disconnection
    socket.on("disconnect", () => {
      console.log(`User disconnected: ${socket.id}`);

      // Remove user from userSocketMap
      userSocketMap.forEach((socketId, userId) => {
        if (socketId === socket.id) {
          userSocketMap.delete(userId);
          console.log(`Removed UserID=${userId} from userSocketMap.`);
        }
      });
    });
  });
}
