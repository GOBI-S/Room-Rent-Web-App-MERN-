import express, { Request, Response } from 'express';
import connectDB from './COnfig/db';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import router from './Routes/global';
import dotenv from 'dotenv';

dotenv.config(); // Load environment variables

const app = express();
const PORT = 5000;

// CORS Options
const corsOptions = {
  origin: 'http://localhost:5173', // Frontend URL
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true, // Allow cookies to be sent
  allowedHeaders: ['Content-Type', 'Authorization'],
};
app.use(cors(corsOptions));

// Middleware
app.use(express.json({ limit: '50mb' })); // Parse JSON body
app.use(express.urlencoded({ limit: '50mb', extended: true })); // Parse URL-encoded body
app.use(cookieParser()); // Parse cookies

// Routes
app.use(router); // Mount routes after middleware

// Connect to database
connectDB();

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
