import { Router, Request, Response, response } from "express";
import bcrypt from "bcrypt";
import { UserSignupModel } from "../models/loginshema"; // Ensure this import path is correct
import { v2 as cloudinaryV2 } from "cloudinary";
import { CreateRoomModel } from "../models/createroom";
const router = Router();
import dotenv from "dotenv";

cloudinaryV2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Login Route
router.post("/login", async (req: any, res: any) => {
  const secretKey = "gobi"; // You can use a more secure key in production
  const Logininputs = req.body;
  console.log(Logininputs.Email, Logininputs.Password);

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

    // Prepare user data for the cookie (do not send sensitive info like password)
    const navitems = {
      Email: user.email,
      Name: user.name,
      Id: user.id,
      Role: user.ownership,
    };
    console.log(navitems);
    try {
      res.cookie("navkeys", JSON.stringify(navitems), {
        // secure: false, // Set to true in production
        sameSite: "lax",
        httpOnly: false, // Prevent client-side JS access to the cookie
      });
      console.log("cookie sended");
    } catch (error) {
      console.log("error whne fecting cookie");
    }

    // Set secure cookie (for HTTPS, make sure to set secure: true)

    // Send user profile data as response
    return res.status(200).json({ profiledata: navitems });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Please sign up first." });
  }
});
router.post("/singup", async (req: any, res: any) => {
  const { Name, EmailID, Password, ConfirmPassword, Ownership } = req.body;
  try {
    const user = await UserSignupModel.findOne({ email: EmailID, name: Name });
    if (!user) {
      const hashedPassword = await bcrypt.hash(Password, 10);
      //data store
      const newUserSchemaforsingup = new UserSignupModel({
        name: Name,
        email: EmailID,
        password: hashedPassword,
        ownership: Ownership,
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
        ConfirmPassword,
        "ship:",
        Ownership
      );
      return res.status(200).json({ message: "singup successful!" });
    } else {
      return res
        .status(401)
        .json({ error: "your email is alredy have an account... plese login" });
    }
  } catch (error) {
    res.status(401).json({ error: "error in finding " });
  }
});
router.post("/Createroom", async (req: any, res: any) => {
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
    const roomData = {
      Email: RoomData.Email,
      Name: RoomData.Name,
      Location: RoomData.Location,
      Price: RoomData.Price,
      Propertyname: RoomData.Propertyname,
      ContactNumber: RoomData.ContactNumber,
      Nobedrooms: RoomData.Nobedrooms,
      images: imageUrls, // Store URLs of the uploaded images
    };
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
});
router.get("/Ownerhome", async (req: any, res: any) => {
  try {
    const email = req.query.email;
    const roomCount = await CreateRoomModel.countDocuments({ Email: email });
    res.status(201).json({ total: roomCount });
  } catch (error) {}
});
router.get("/Olistroom", async (req: any, res: any) => {
  try {
    const email = req.query.email;
    const rooms = await CreateRoomModel.find({ Email: email });
    res.status(201).json(rooms);
  } catch (error) {
    res.status(500).json({ message: "failed to find the list of room" });
  }
});
router.get("/Edit", async (req: any, res: any) => {
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
    const imageUrls = [];
    // console.log(data.Delurls)
    //cloudinary delete...
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
        {  $set:roomData },
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
    res.status(200).json("updated Successfully")

    console.log(roomData);
  } catch (error) {
    console.log(error);
  }
});
///delete api
router.delete("/Delete",async(req:any,res:any)=>{
  const data=req.body
  try {
    const deletedata=await CreateRoomModel.deleteOne({_id:data.id})
    if(deletedata.deletedCount>0){
      res.status(200).json({message:"Deleted Successfuly"})
    }
  } catch (error) {
    res.status(500).json(error)
  }
})

export default router;
