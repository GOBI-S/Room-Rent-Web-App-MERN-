import mongoose from "mongoose";

 const UserSchemaforlogin = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
    unique: true,
  },
});
const UserSchemaforsingup=new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    email:{
        type: String,
        required: true,
        unique:true,
    },
    password:{
        type:String,
        required:true,
        unique:true,
    },

});
export const UserLoginModel = mongoose.model("UserLogin", UserSchemaforlogin);
export const UserSignupModel = mongoose.model("UserSignup", UserSchemaforsingup);