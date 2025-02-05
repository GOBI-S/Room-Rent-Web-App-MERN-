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

const LoginPage = ({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) => {
  const dispatch = useAppDispatch();
  const [Le, setLe] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const LoginInput = {
    Email: email,
    Password: password,
  };

  const login = async () => {
    try {
      const response = await axios.post(
        "http://localhost:5000/login",
        LoginInput,
        { withCredentials: true }
      );

      const navitems = Cookies.get("navkeys");
      if (navitems) {
        const parsedNavItems = JSON.parse(navitems);
        dispatch(
          setUser({
            name: parsedNavItems.Name,
            email: parsedNavItems.Email,
            Userid: parsedNavItems.Id,
          })
        );
      }

      // Navigate based on role
      if (response.data.profiledata.Role === "Owner") {
        navigate("/Home");
      } else {
        navigate("/Searchrooms");
      }
    } catch (error) {
      console.error("Login failed:", error);
      setLe("border-red-600");
      alert("Invalid email or password. Please try again.");
      setTimeout(() => setLe(""), 2000);
    }
  };

  return (
    <div
      className={cn(
        "min-h-screen flex min-w-screen justify-center items-center",
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
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Password</Label>
              </div>
              <Input
                id="password"
                type="password"
                className={`${Le ? Le : ""}`}
                required
                onChange={(e) => setPassword(e.target.value)}
              />
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
};

export default LoginPage;