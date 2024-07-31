import express from "express";
import mongoose from 'mongoose';
import roleRoute from './routes/role.js'
import authRoute from "./routes/auth.js";
import userRoute from './routes/user.js';

import dotenv from 'dotenv';
dotenv.config();
  
const app = express();

app.use(express.json());
app.use('/api/role', roleRoute);
app.use('/api/auth', authRoute);
app.use('/api/user', userRoute);

app.use( (obj, req, res, next) => {
    const statusCode = obj.status || 500;
    const errorMessage = obj.message || 'Something went wrong! Internal server error';
    return res.status(statusCode).json({
        status: statusCode,
        message: errorMessage,
        stack: obj.stack,
        success: [200,201,202,203,204].some( e=> e === statusCode? true : false),
        data: obj.data
    })
})

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log('Connected to db');
    } catch (error) {
        throw error;
    }
}; 

app.listen(8802, () => {
    connectDB();
    console.log("Connected to backend")
});