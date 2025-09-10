import dotenv from "dotenv";
dotenv.config({ path: "./.env" }); 
import express from "express"; 
import authRoutes from "./src/routes/auth.route.js";
import messageRoutes from "./src/routes/message.route.js";
import cookieParser from "cookie-parser";
import { connectDB } from "./src/lib/db.js";
import {app,server} from "./src/lib/socket.js";
import cors from "cors";

import path from "path";


const PORT = process.env.PORT;
const __dirname=path.resolve();

app.use(express.json()) // use this before any route to pass data in json format
app.use(cookieParser())
app.use(cors({
  origin:"http://localhost:5173",
  credentials:true
}
))

app.use("/api/auth", authRoutes);
app.use("/api/messages",messageRoutes);

if(process.env.NODE_ENV==="production")
{
  app.use(express.static(path.join(__dirname,"../Frontend/dist")));

  app.get(/.*/,(req,res)=>
  {
    res.sendFile(path.join(__dirname,"../Frontend","dist","index.html"));
  })
}

server.listen(PORT, () => {
  connectDB();
  console.log("Server is running on port " + process.env.PORT);
  
  
});