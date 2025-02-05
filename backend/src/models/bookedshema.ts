import mongoose, { Schema } from "mongoose";
const bookedshema = new Schema({
  booked: [
    {
      roomid:{type:String,required:true},
      bookerId: {type:String,required:true},
      from:{type:Date,required:true},
      to:{type:Date}
    },
  ],
  });
  const bookschema = mongoose.model('ChatList', bookedshema);
  export default bookschema;