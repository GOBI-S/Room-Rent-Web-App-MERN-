import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const secretKey = process.env.JWT_SECRET_KEY;

// Extending the Request type to include 'user'
interface AuthRequest extends Request {
  user?: any;
}

const   tokenverify = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  const token = req.cookies.authToken;
  if (!token) {
    // Return 401 error when token is missing
     res.status(401).json({ message: "Access denied. No token provided." });
  }
else{
  try {
    if (!secretKey) {
      throw new Error("Missing JWT secret key. Please set JWT_SECRET_KEY in your environment variables.");
    }
    const decoded = jwt.verify(token, secretKey);
    req.user = decoded; // Attach decoded user data to the request
    next(); // Proceed to the next middleware or route handler
  } catch (err) {
    // Return 401 error for invalid/expired token
     res.status(401).json({ message: "Invalid or expired token" });
  }
}
};


export default tokenverify;
