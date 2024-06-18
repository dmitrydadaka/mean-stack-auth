import e from "express";
import express from "express";
import mongoose from 'mongoose';
import roleRoute from './routes/role.js'
import authRoute from "./routes/auth.js";

import dotenv from 'dotenv';
dotenv.config();

const app = express();

app.use(express.json());
app.use('/api/role', roleRoute);
app.use('/api/auth', authRoute);



const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log('Connected to db');
    } catch (error) {
        throw error;
    }
};

app.listen(8800, () => {
    connectDB();
    console.log("Connected to backend")
});