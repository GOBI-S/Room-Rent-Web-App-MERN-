import { Router, Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { UserSignupModel } from "../models/loginshema"; // Ensure this import path is correct
import { v2 as cloudinaryV2 } from "cloudinary";
import { CreateRoomModel } from "../models/createroom";
import Bookschema from "../models/bookedshema";
const router = Router();
import path from "path";
import fs from "fs";
import dotenv from "dotenv";
import tokenverify from "../Controllers/jwttokenverify"; // Adjust the relative path if necessary
import Room from '../models/bookedshema';
import { CronJob } from "cron";
import mongoose from "mongoose";
cloudinaryV2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const filePath = path.join(__dirname, "testBookings.json");
// Login Route
router.post("/login", async (req: any, res: any) => {
  const secretKey = "gobi"; // You can use a more secure key in production
  const Logininputs = req.body;

  try {
    if (!Logininputs.Email || !Logininputs.Password) {
      return res
        .status(400)
        .json({ error: "Email and password are required." });
    }
    // Find the user by email
    const user = await UserSignupModel.findOne({ email: Logininputs.Email });

    console.log("finded");

    // If user doesn't exist
    if (!user) {
      return res.status(401).json({ error: "Invalid email or password." });
    }

    const hashedPassword = user.password;

    // Compare the provided password with the stored hashed password
    const isMatch = await bcrypt.compare(Logininputs.Password, hashedPassword);

    if (!isMatch) {
      return res.status(401).json({ error: "Invalid email or password." });
    }

    const token = jwt.sign({ email: Logininputs.Email }, secretKey, {
      expiresIn: "30m",
    });
    console.log(token);
    res.cookie("authToken", token, {
      httpOnly: true, // Prevents access to the cookie via JavaScript
      secure: false, // Only true in production with HTTPS
      sameSite: "lax", // Strict option for better security
      maxAge: 30 * 60 * 1000,
      path: "/", // 30 minutes
    });

    // Prepare user data for the cookie (do not send sensitive info like password)
    const navitems = {
      Email: user.email,
      Name: user.name,
      Id: user._id,
    };
    console.log(navitems);
    try {
      res.cookie("navkeys", JSON.stringify(navitems), {
        // Use true in production (HTTPS)
        secure: true, // Use only on HTTPS
        sameSite: "lax", // Prevent CSRF
      });
      // console.log("cookie sended");
    } catch (error) {
      // console.log("error whne fecting cookie");
    }
    // Send user profile data as response
    return res.status(200).json({ profiledata: navitems });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Please sign up first." });
  }
});
router.post(
  "/singup",
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { Name, EmailID, Password, ConfirmPassword } = req.body;
    try {
      const user = await UserSignupModel.findOne({
        email: EmailID,
        name: Name,
      });
      if (!user) {
        const hashedPassword = await bcrypt.hash(Password, 10);
        //data store
        const newUserSchemaforsingup = new UserSignupModel({
          name: Name,
          email: EmailID,
          password: hashedPassword,
        });
        await newUserSchemaforsingup.save();
        console.log(
          "name:",
          Name,
          "Email:",
          EmailID,
          "password:",
          Password,
          "confirmpassword:",
          ConfirmPassword
        );
        res.status(200).json({ message: "singup successful!" });
      } else {
        res.json({
          error: "your email is alredy have an account... plese login",
        });
      }
    } catch (error) {
      res.json({ error: "error in finding " });
    }
  }
);
router.post(
  "/Createroom",
  tokenverify,
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const RoomData = req.body;
      const {
        Name,
        Email,
        Location,
        Price,
        Propertyname,
        ContactNumber,
        Nobedrooms,
        Createrid,
      } = RoomData;
      const imageUrls = [];
      try {
        for (let i = 0; i < RoomData.images.length; i++) {
          const base64Image = RoomData.images[i]; // Assume each image is base64 encoded
          const result = await cloudinaryV2.uploader.upload(base64Image, {
            resource_type: "auto",
          }); // 'auto' type auto detects the image format
          imageUrls.push(result.secure_url); // Save the Cloudinary URL
        }
      } catch (error) {
        res.status(500).json({ message: "Failed conert bs64", error });
      }
      // const roomData = {
      //   Email: RoomData.Email,
      //   Name: RoomData.Name,
      //   Location: RoomData.Location,
      //   Price: RoomData.Price,
      //   Propertyname: RoomData.Propertyname,
      //   ContactNumber: RoomData.ContactNumber,
      //   Nobedrooms: RoomData.Nobedrooms,
      //   images: imageUrls, // Store URLs of the uploaded images
      //   Createrid:RoomData.Createrid
      // };
      try {
        const createroom = new CreateRoomModel({
          Name: Name,
          Email: Email,
          Location: Location,
          Price: Price,
          Propertyname: Propertyname,
          ContactNumber: ContactNumber,
          Nobedrooms: Nobedrooms,
          images: imageUrls,
          Createrid: Createrid,
        });
        const savedRoom = await createroom.save();
        res
          .status(201)
          .json({ message: "Room created successfully", data: savedRoom });
      } catch (error) {
        console.error("Error saving data:", error); // Log any error
        res.status(500).json({ message: "Failed to save data", error });
      }

      console.log();
    } catch (error) {
      console.log("error on cloudinary");
    }
  }
);
router.get("/Ownerhome", tokenverify, async (req: any, res: any) => {
  try {
    const email = req.query.email;
    const roomCount = await CreateRoomModel.countDocuments({ Email: email });
    res.status(201).json({ total: roomCount });
  } catch (error) {}
});
router.get("/Olistroom", tokenverify, async (req: any, res: any) => {
  try {
    const email = req.query.email;
    const rooms = await CreateRoomModel.find({ Email: email });
    res.status(201).json(rooms);
  } catch (error) {
    res.status(500).json({ message: "failed to find the list of room" });
  }
});
router.get("/Edit", tokenverify, async (req: any, res: any) => {
  try {
    const id = req.query.id;
    const Editroom = await CreateRoomModel.findOne({ _id: id });
    res.status(201).json(Editroom);
  } catch (error) {
    res.status(500).json({ message: "failed find edit room" });
  }
});
router.put("/Editeddata", async (req: any, res: any) => {
  try {
    const data = await req.body;
    try {
      const deleteing = await cloudinaryV2.api.delete_resources(data.Delurls);
      console.log("Deleted resources:", deleteing);
    } catch (error) {
      console.log(error);
    }
    /// cloudindary convert from bs64
    try {
      for (let i = 0; i < data.NormalUrl.length; i++) {
        const base64Image = data.NormalUrl[i]; // Assume each image is base64 encoded
        const result = await cloudinaryV2.uploader.upload(base64Image, {
          resource_type: "auto",
        }); // 'auto' type auto detects the image format
        data.Cloudurl.push(result.secure_url); // Save the Cloudinary URL
      }
    } catch (error) {
      res.status(500).json({ message: "Failed convert bs64", error });
    }
    const roomData = {
      Email: data.Email,
      Name: data.Name,
      Location: data.Location,
      Price: data.Price,
      Propertyname: data.Propertyname,
      ContactNumber: data.ContactNumber,
      Nobedrooms: data.Nobedrooms,
      images: data.Cloudurl,
    };
    ///database update
    try {
      const updatedata = await CreateRoomModel.findByIdAndUpdate(
        data.id,
        { $set: roomData },
        { new: true }
      );
      if (updatedata) {
        console.log("User updated successfully:", updatedata);
      } else {
        console.log("No user found with the given ID.");
      }
    } catch (error) {
      console.log(error);
    }
    res.status(200).json("updated Successfully");

    console.log(roomData);
  } catch (error) {
    console.log(error);
  }
});
///delete api
router.delete("/Delete", async (req: any, res: any) => {
  const data = req.body;
  try {
    const deletedata = await CreateRoomModel.deleteOne({ _id: data.id });
    if (deletedata.deletedCount > 0) {
      res.status(200).json({ message: "Deleted Successfuly" });
    }
  } catch (error) {
    res.status(500).json(error);
  }
});
/////////////////user api
router.get("/Userhome", tokenverify, async (req: Request, res: Response) => {
  try {
    const data = await CreateRoomModel.find();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json(error);
  }
});
router.get(
  "/bookingroomdata",
  tokenverify,
  async (req: Request, res: Response) => {
    try {
      const id = req.query.id;
      const roombookingdata = await CreateRoomModel.findOne({ _id: id });
      res.status(201).json(roombookingdata);
    } catch (error) {
      res.status(500).json({ message: "failed find User clicked Room room" });
    }
  }
);
// const writeBookings = (bookings: any[]) => {
//   fs.writeFileSync(filePath, JSON.stringify(bookings, null, 2));
// };

// const readBookings = () => {
//   try {
//     const data = fs.readFileSync(filePath, "utf-8");
//     return JSON.parse(data);
//   } catch (error) {
//     return [];
//   }
// };
router.post("/booked", async (req: Request, res: Response) => {
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
});

router.get("/bookings/get", async (req: any, res: any) => {
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
});

// GET /bookings/gets - Get all bookings
router.get("/bookings/gets", async (req: Request, res: Response) => {
  try {
      const data = await Room.find({});
      res.json(data);
  } catch (error) {
      res.status(500).json({ message: "Error in getting booking data" });
  }
});

// DELETE /bookings/:roomid - Delete a room and its bookings
router.delete("/bookings/:roomid", async (req: Request, res: Response) => {
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
});

// const Room = mongoose.model<IRoom>('Room', Bookschema);
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

      console.log('Past bookings removed successfully.');
  } catch (err) {
      console.error('Error removing past bookings:', err);
  }
}

// Set up a cron job to run the function daily at midnight
const job = new CronJob('0 0 * * *', removePastBookings); // Runs at 00:00 every day
job.start();

console.log('Cron job started. It will run daily at midnight.');


export default router;
