import mongoose from "mongoose";
const CreateroomSchema = new mongoose.Schema(
  {
    Email: {
      type: String,
      required: true,
    },
    Name: {
      type: String,
      required: true,
    },
    Location: {
      type: String,
      required: true,
    },
    Price: {
      type: String,
      required: true,
    },
    Propertyname: {
      type: String,
      required: true,
    },
    ContactNumber: {
      type: String,
      required: true,
    },
    Nobedrooms: {
      type: String,
      enum: ["SingleBedroom", "DoubleBedroom", "MorethanDoubleBedroom"], // Predefined bedroom options
      required: true,
    },
    images: { type: [String], required: true },
    Createrid: { type: String, required: true }
  },
  { timestamps: true }
);
// Export the model like this

export const CreateRoomModel = mongoose.model("CreateRoom", CreateroomSchema);
