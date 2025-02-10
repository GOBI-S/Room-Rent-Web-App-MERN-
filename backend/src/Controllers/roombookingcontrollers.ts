import { Request, Response } from "express";
import { CreateRoomModel } from "../models/createroom";
import Room from "../models/bookedshema";
import dotenv from 'dotenv';
dotenv.config();

export const BookingRoomData = async (req: Request, res: Response) => {
  try {
    const id = req.query.id;
    const roombookingdata = await CreateRoomModel.findOne({ _id: id });
    res.status(201).json(roombookingdata);
  } catch (error) {
    res.status(500).json({ message: "failed find User clicked Room room" });
  }
};
export const RoomBooking = async (req: Request, res: Response) => {
  try {
    const { roomid, bookerId, from, to } = req.body;

    if (!roomid || !bookerId || !from || !to) {
      res.status(400).json({ message: "Missing required fields" });
    }

    // Find the room or create a new one if it doesn't exist
    let room = await Room.findOne({ roomid });

    if (!room) {
      room = new Room({ roomid, booked: [] });
    }

    // Check for overlapping bookings
    const isOverlap = room.booked.some(
      (booking) =>
        new Date(booking.from) < new Date(to) &&
        new Date(booking.to) > new Date(from)
    );

    if (isOverlap) {
      res.status(400).json({ message: "Selected dates are already booked" });
    }

    // Add the new booking
    room.booked.push({ bookerId, from, to });

    // Save the room with the new booking
    await room.save();

    res.json({ message: "Booking added!", room });
  } catch (error) {
    console.error("Error in booking:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
export const GetRoomBookingData = async (req: any, res: any) => {
    try {
      const { roomId } = req.query;
  
      if (!roomId) {
        const allRooms = await Room.find({});
        return res.json(allRooms); // Use `return` to exit the function
      }
  
      const room = await Room.findOne({ roomid: roomId });
  
      if (!room) {
        return res.json([]); // Use `return` to exit the function
      }
  
      return res.json(room.booked); // Use `return` to exit the function
    } catch (error) {
      console.error("Error fetching bookings:", error);
      return res.status(500).json({ error: "Internal server error" }); // Use `return` to exit the function
    }
  }
export const GetRoomBookingDatas=async (req: Request, res: Response) => {
    try {
      const data = await Room.find({});
      res.json(data);
    } catch (error) {
      res.status(500).json({ message: "Error in getting booking data" });
    }
  }
export const DeleteRoom=async (req: Request, res: Response) => {
    try {
      const { roomid } = req.params;
  
      const result = await Room.deleteOne({ roomid });
  
      if (result.deletedCount === 0) {
        res.status(404).json({ message: "Room not found" });
      }
  
      res.json({ message: "Booking deleted" });
    } catch (error) {
      console.error("Error deleting booking:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }