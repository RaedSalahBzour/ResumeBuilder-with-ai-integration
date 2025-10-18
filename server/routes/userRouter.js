import express from "express";
import protect from "../middlewares/authMiddleware.js";
import {
  registerUser,
  loginUser,
  getUserResumes,
  getUserById,
} from "../controllers/userController.js";

const userRouter = express.Router();

// Public routes
userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);

// Protected route
userRouter.get("/data", protect, getUserById);
userRouter.get("/resumes", protect, getUserResumes);

export default userRouter;
