import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import NoteRoute from "./routes/NoteRoutes.js";
import UserRoute from "./routes/UserRoutes.js";
import CommentRoute from "./routes/CommentRoutes.js";
import GameRequestRoute from "./routes/GameRequestRoutes.js"

import cors from "cors";
dotenv.config();

const app = express();
const port = process.env.PORT;
const DB = process.env.MONGO_URL;

//middleware
app.use(express.json());
app.use(cors());

//Routes
app.use("/api",UserRoute)
app.use("/api",NoteRoute)
app.use("/api",CommentRoute)
app.use("/api",GameRequestRoute)


mongoose.connect(DB).then(()=>{
    app.listen(port,()=>{
        console.log(`Server on port ${port} and Database Connected`);
    });
}).catch((error)=>console.log(error))