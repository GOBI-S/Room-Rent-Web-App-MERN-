import { Router} from "express";
import { v2 as cloudinaryV2 } from "cloudinary";
const router = Router();
import path from "path";
import tokenverify from "../Controllers/jwttokenverify"; // Adjust the relative path if necessary
import Room from "../models/bookedshema";
import { CronJob } from "cron";
import {
  CreateRoom,
  DeleteRoom,
  GetDataForEdit,
  GetMyRooms,
  GetRoomForHome,
  GetRoomForUserHome,
  ModifyDataUploadEditeddata,
} from "../Controllers/roomcontrollers";
import {
  BookingRoomData,
  GetRoomBookingData,
  GetRoomBookingDatas,
  RoomBooking,
} from "../Controllers/roombookingcontrollers";
import { LoginControl, SignupControl } from "../Controllers/loginandsingupcontroller";
import dotenv from 'dotenv';
dotenv.config();
cloudinaryV2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const filePath = path.join(__dirname, "testBookings.json");
// Login Route
router.post("/login",LoginControl );
router.post("/singup", SignupControl);
router.post("/Createroom", tokenverify, CreateRoom);
router.get("/Ownerhome", tokenverify, GetRoomForHome);
router.get("/Olistroom", tokenverify, GetMyRooms);
router.get("/Edit", tokenverify, GetDataForEdit);
router.put("/Editeddata", ModifyDataUploadEditeddata);
router.delete("/Delete", DeleteRoom);
router.get("/Userhome", tokenverify, GetRoomForUserHome);
router.get("/bookingroomdata", tokenverify, BookingRoomData);
router.post("/booked", RoomBooking);
router.get("/bookings/get", GetRoomBookingData);
// GET /bookings/gets - Get all bookings
router.get("/bookings/gets", GetRoomBookingDatas);
router.delete("/bookings/:roomid", DeleteRoom);
async function removePastBookings() {
  const currentDate = new Date();

  try {
    // Find all rooms
    const rooms = await Room.find({});

    for (const room of rooms) {
      // Filter out past bookings
      room.booked = room.booked.filter((booking) => {
        return booking.to >= currentDate; // Keep bookings that are still active
      });

      // Save the updated room document
      await room.save();
      console.log(`Updated room with ID ${room.roomid}.`);
    }

    console.log("Past bookings removed successfully.");
  } catch (err) {
    console.error("Error removing past bookings:", err);
  }
}

// Set up a cron job to run the function daily at midnight
const job = new CronJob("0 0 * * *", removePastBookings); // Runs at 00:00 every day
job.start();

console.log("Cron job started. It will run daily at midnight.");

export default router;
