import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Cardheader from "./logincomponents/Cardheader";
import { useState, useRef, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "@/hooks/redduxhook";
import { setUser } from "@/store/slice.ts";
import "animate.css"; // Import animate.css for animations

const LoginPage = ({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) => {
  const dispatch = useAppDispatch();
  const [Le, setLe] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const URI2="http://localhost:5000";
  const URI=URI2;
  // const URI="https://roomrentweb.gobidev.site";
  // Focus on the email input when the component mounts
  useEffect(() => {
    if (emailRef.current) {
      emailRef.current.focus();
    }
  }, []);

  const LoginInput = {
    Email: email,
    Password: password,
  };

  const login = async () => {
    if (!email || !password) {
      setLe("border-red-600");
      alert("Please fill in all fields.");
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post(
        `${URI}/login`,
        LoginInput,
        { withCredentials: true }
      );

      const navitems = Cookies.get("navkeys");
      console.log(navitems)
      console.log("Response from server:", response.data.message);
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
        navigate("/Searchrooms");
    } catch (error) {
      console.error("Login failed:", error);
      setLe("border-red-600");
      alert("Invalid email or password. Please try again.");
      setTimeout(() => setLe(""), 2000);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Enter key press
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      if (e.currentTarget.id === "email" && passwordRef.current) {
        passwordRef.current.focus(); // Move focus to password input
      } else if (e.currentTarget.id === "password") {
        login(); // Submit the form
      }
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
      <Card className="min-h-fit min-w-fit h-fit w-full max-w-md animate__animated animate__fadeIn">
        <Cardheader />
        <CardContent>
          <div className="flex flex-col gap-6">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={handleKeyDown}
                ref={emailRef}
                className={Le}
              />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Password</Label>
              </div>
              <Input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={handleKeyDown}
                ref={passwordRef}
                className={Le}
              />
            </div>
            <Button
              type="submit"
              onClick={login}
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-t-transparent border-white rounded-full animate-spin"></div>
                  Logging in...
                </div>
              ) : (
                "Login"
              )}
            </Button>
          </div>
          <div className="mt-4 text-center text-sm">
            Don&apos;t have an account?{" "}
            <a
              href="/Singup"
              className="underline underline-offset-4"
            >
              Sign up
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginPage;