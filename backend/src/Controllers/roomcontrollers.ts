import { Request, Response } from "express";
import { CreateRoomModel } from "../models/createroom";
import { v2 as cloudinaryV2 } from "cloudinary";
import dotenv from 'dotenv';
dotenv.config();
cloudinaryV2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
export const CreateRoom = async (req: Request, res: Response): Promise<void> => {
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
    } catch (error) {
      console.log("error on cloudinary");
    }
  }
export const GetRoomForHome = async (req: any, res: any) => {
    try {
      const email = req.query.email;
      const roomCount = await CreateRoomModel.countDocuments({ Email: email });
      res.status(201).json({ total: roomCount });
    } catch (error) {}
  }
export const GetMyRooms = async (req: any, res: any) => {
    try {
      const email = req.query.email;
      const rooms = await CreateRoomModel.find({ Email: email });
      res.status(201).json(rooms);
    } catch (error) {
      res.status(500).json({ message: "failed to find the list of room" });
    }
  }
export const GetDataForEdit =async (req: any, res: any) => {
    try {
      const id = req.query.id;
      const Editroom = await CreateRoomModel.findOne({ _id: id });
      res.status(201).json(Editroom);
    } catch (error) {
      res.status(500).json({ message: "failed find edit room" });
    }
  }
  export const ModifyDataUploadEditeddata = async (req: any, res: any) => {
    try {
      const data = await req.body;
      try {
        const deleteing = await cloudinaryV2.api.delete_resources(data.Delurls);
        // console.log("Deleted resources:", deleteing);
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
  }
export const DeleteRoom =  async (req: any, res: any) => {
    const data = req.body;
    try {
      const deletedata = await CreateRoomModel.deleteOne({ _id: data.id });
      if (deletedata.deletedCount > 0) {
        res.status(200).json({ message: "Deleted Successfuly" });
      }
    } catch (error) {
      res.status(500).json(error);
    }
  }
export const GetRoomForUserHome =async (req: Request, res: Response) => {
    try {
      const data = await CreateRoomModel.find();
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json(error);
    }
  } 