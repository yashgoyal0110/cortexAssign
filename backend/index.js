import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
dotenv.config();
const PORT = process.env.PORT || 3000;

const app = express();
app.use(cors());
app.use(express.json());

mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
        console.log('Connected to MongoDB ✅');
        app.listen(PORT, ()=>console.log(`Server Running on port ${PORT} 🚀`))
    })
    .catch((err)=>console.log('Error connecting to MongoDB ❌', err));