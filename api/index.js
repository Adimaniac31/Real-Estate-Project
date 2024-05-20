import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRouter from './routes/user.route.js';
import authRouter from './routes/auth.route.js';
import listingRouter from './routes/listing.route.js';
import cookieParser from 'cookie-parser';
import path from 'path';
import cors from 'cors';
dotenv.config();

mongoose.connect(process.env.MONGO).then(()=>{
    console.log('MongoDB Connected');
    }).catch((err)=>{
        console.error(err);
    });

    const __dirname = path.resolve();

const app = express();

app.use(cors({
    origin: 'https://real-estate-project-8x2m.onrender.com/', // Replace with your frontend origin
    // origin: 'http://localhost:5173',
    credentials: true
  }));

app.use(express.json());
app.use(cookieParser());

app.use("/api/user",userRouter);
app.use('/api/auth',authRouter);
app.use('/api/listing',listingRouter);

app.use(express.static(path.join(__dirname,'/RealEstateProject/dist')));
app.get('*', (req,res) => {
    res.sendFile(path.join(__dirname,'RealEstateProject','dist','index.html'));    
});

app.listen(3000,()=>{
        console.log("Server is running on port 3000");
    }
);

app.use((err,req,res,next)=>{
    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    return res.status(statusCode).json({
        success:false,
        statusCode,
        message,
    });
});