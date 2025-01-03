import express, { Request, Response } from 'express';// Import the router from the global routes file
import connectDB from './COnfig/db';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import router from './Routes/global';
import dotenv from "dotenv";
dotenv.config();
const app = express();
const PORT = 5000;

// Middleware to parse JSON
const corsOptions = {
    origin: 'http://localhost:5173', // Frontend URL
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization'],
  };
  app.use(cors(corsOptions));
  
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cookieParser());
app.use(express.json());
app.use(router)

connectDB()
// Mount the user router

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});