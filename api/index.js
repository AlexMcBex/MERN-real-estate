import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRouter from "./routes/user.route.js";
import authRouter from './routes/auth.route.js'
dotenv.config();

mongoose
  .connect(process.env.MONGODB)
  .then(() => {
    console.log("=== Connected to MongoDB ===");
  })
  .catch((err) => {
    console.log(`!!! ${err} !!!`);
  });

const app = express();
// express.json turns undefined info to json format info
app.use(express.json())

app.listen(3000, () => {
  console.log("=== Server running on port 3000 ===");
});

// API User Route
app.use("/api/user", userRouter);
app.use("/api/auth", authRouter);
