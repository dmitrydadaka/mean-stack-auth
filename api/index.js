import e from "express";
import express from "express";
import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const app = express();

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log('Connected to db');
    } catch (error) {
        throw error;
    }
}


app.listen(8800, () => {
    connectDB();
    console.log("Connected to backend")
})