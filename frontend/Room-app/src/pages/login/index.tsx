import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Cardheader from "./logincomponents/Cardheader";
import { useState } from "react";
import axios from "axios"
import Cookies from 'js-cookie';
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "@/hooks/redduxhook";
import { setUser } from "@/store/slice.ts";

export function LoginPage({

  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const dispatch = useAppDispatch();
  const[Le,setLe]=useState("")
  const [email,setemail]=useState("")
  const[password,setpassword]=useState("")
  const LoginInput={
    Email:email,
    Password:password,
  }
  const navigate=useNavigate();
  const login=async() =>{

    try {
      const response = await axios.post("http://localhost:5000/login",LoginInput,{ withCredentials: true });
      console.log(Cookies.get)
      const navitems = Cookies.get("navkeys");
      if (navitems) {
        try {
          const parsedNavItems = JSON.parse(navitems);

          /////redux storing ////
          dispatch(setUser({ name: parsedNavItems.Name, email: parsedNavItems.Email,  role: parsedNavItems.Role }));
          //////////////////////



        } catch (error) {
          console.error("Failed to parse navkeys cookie:", error);
        }
      } else {
        console.log("No navkeys cookie found");
      }
      if(response.data.profiledata.Role == "Owner"){
        setTimeout(() => {// Redirect to a protected route
          navigate("/ownerhome")
        }, 100);
      }
      else{
        setTimeout(() => {// Redirect to a protected route
          navigate("/Userhome")
        }, 100);
      }
    } catch (error) {
      console.log("error in front api")
      setLe("border-red-600")
      setTimeout(() => {
        setLe("");
      }, 2000);
    }
  };
  
  return (
    <div
      className={cn(
        "min-h-screen flex min-w-screen justify-center align items-center",
        className
      )}
      {...props}
    >
      <Card className="min-h-fit min-w-fit h-fit">
        <Cardheader />
        <CardContent>
            <div className={`flex flex-col gap-6`}>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  onChange={(e)=>setemail(e.target.value)}
                />
              </div>
              <div className="grid gap-2 ">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                </div>
                <Input id="password" type="password" className={`${Le?Le:""}`} required onChange={(e)=>setpassword(e.target.value)} />
              </div>  
              <Button type="submit" onClick={login} className="w-full">
                Login
              </Button>
            </div>
            <div className="mt-4 text-center text-sm">
              Don&apos;t have an account?{" "}
              <a href="/Singup" className="underline underline-offset-4">
                Sign up
              </a>
            </div>
        </CardContent>
      </Card>
    </div>
  );
}
