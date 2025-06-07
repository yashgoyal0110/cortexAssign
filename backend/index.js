import express from 'express';
import {serve} from "inngest/express"
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import userRoutes from './routes/user.js'
import ticketRoutes from './routes/ticket.js';
import { inngest } from './inngest/client.js';
import { onSignup } from './inngest/functions/on-signup.js';
import { onTicketCreated } from './inngest/functions/on-ticket-create.js';

dotenv.config();
const PORT = process.env.PORT || 3000;

const app = express();
app.use(cors());
app.use(express.json());

// app.use(
//     "/api/ingest",
//     serve({
//         client: inngest,
//         functions: [onSignup, onTicketCreated]
//     })
// )
app.use('/api/auth', userRoutes)
app.use('/api/tickets', ticketRoutes);
mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
        console.log('Connected to MongoDB ✅');
        app.listen(PORT, ()=>console.log(`Server Running on port ${PORT} 🚀`))
    })
    .catch((err)=>console.log('Error connecting to MongoDB ❌', err.message));