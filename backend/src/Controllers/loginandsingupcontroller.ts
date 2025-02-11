import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { UserSignupModel } from "../models/loginshema";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export const SignupControl = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { Name, EmailID, Password, ConfirmPassword } = req.body;

  try {
    // Check if passwords match
    if (Password !== ConfirmPassword) {
      res.status(400).json({ error: "Passwords do not match!" });
      return;
    }

    // Check if user already exists (only by email)
    const existingUser = await UserSignupModel.findOne({ email: EmailID });

    if (existingUser) {
      res
        .status(409)
        .json({ error: "Your email already has an account. Please login." });
      return;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(Password, 10);

    // Create new user
    const newUser = new UserSignupModel({
      name: Name,
      email: EmailID,
      password: hashedPassword,
    });

    await newUser.save();

    // console.log("User signed up:", { Name, EmailID });

    res.status(201).json({ message: "Signup successful!" });
  } catch (error) {
    res.status(500).json({ error: "An error occurred during signup." });
  }
};
export const LoginControl = async (req: any, res: any) => {
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
      secure: true, // Required for `sameSite: "None"`
      sameSite: "None", // Allows cross-site access
      maxAge: 30 * 60 * 1000, // 30 minutes
      path: "/", // Accessible across the entire site
    });

    // Prepare user data for the cookie (do not send sensitive info like password)
    const navitems = {
      Email: user.email,
      Name: user.name,
      Id: user._id,
    };
    console.log(navitems);
    try {
      const isProduction = process.env.NODE_ENV === "production";

      res.cookie("navkeys", JSON.stringify(navitems), {
        httpOnly: false, // Allows client-side access (not recommended for sensitive data)
        secure: isProduction, // Use HTTPS only in production
        sameSite: isProduction ? "none" : "lax", // Cross-site for production, lax for development
        maxAge: 24 * 60 * 60 * 1000, // 1 day
        path: "/", // Available across the entire site
        domain: isProduction ? ".gobidev.site" : "localhost", // Use localhost in development
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
};
