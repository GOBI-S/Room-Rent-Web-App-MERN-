import {
  Card,
} from "@/components/ui/card"
import  CardHeader  from "./singupcomponents/Cardheader"
import Cardbody from "./singupcomponents/Cardbody";
import CardFoot from "./singupcomponents/CardFoot";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useState } from "react";


export default function SingUppage() {
  const navigate = useNavigate();
  const [signUpInputs, setSignUpInputs] = useState({
    Name: "",
    EmailID: "",
    Password: "",
    ConfirmPassword: "",
  });
   const singupapi =async()=>{
    try {
      console.log(signUpInputs)
      const response=await axios.post("http://localhost:5000/singup",signUpInputs);
      console.log("response from server :",response.data.message)
      navigate("/login")
    } catch (error:any) {
      console.log("response from server :",error.response.data.error);
      alert("hello "+signUpInputs.Name+" "+error.response.data.error)
    }
  }
      const showidpass = async () => {
        // Check if any field is empty
        const isAnyFieldEmpty = Object.values(signUpInputs).some((value) => !value);
      
        if (isAnyFieldEmpty) {
          alert("Please enter all fields to proceed.");
          // console.log("Please enter all fields to proceed.");
        } else if (signUpInputs.Password === signUpInputs.ConfirmPassword) {
          try {
            await singupapi(); // Assuming singupapi is an async function that needs to be awaited
          } catch (error) {
            console.log("Error during signup:", error);
          }
        } else {
          console.log("Password and Confirm Password do not match.");
        }
      };
      

  return (
      <div className="w-full h-screen flex justify-center items-center">
    <Card className="w-[350px]">
      <CardHeader />
      <Cardbody signUpInputs={signUpInputs} SetSignUpInputs={setSignUpInputs} pass={showidpass} />
      <CardFoot durr={showidpass}/>
    </Card >
      </div>
  )
}