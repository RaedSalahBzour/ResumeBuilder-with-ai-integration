import express from "express";
import "dotenv/config";
import cors from "cors";
import connectDB from "./config/db.js";
import userRouter from "./routes/userRouter.js";
import resumeRouter from "./routes/resumeRouter.js";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
//DataBase connection
await connectDB();

// Basic route
app.get("/", (req, res) => {
  res.send("resume builder");
});
app.use("/api/user", userRouter);
app.use("/api/resume", resumeRouter);

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
