import express from "express";
import protect from "../middlewares/authMiddleware.js";
import {
  createResume,
  deleteResume,
  getPublicResume,
  getResumeById,
  updateResume,
} from "../controllers/resumeController.js";
import upload from "../config/multer.js";

const resumeRouter = express.Router();

resumeRouter.post("/create", protect, createResume);
resumeRouter.put("/update", upload.single("image"), protect, updateResume);
resumeRouter.delete("/delete/:resumeId", protect, deleteResume);
resumeRouter.get("/get/:resumeId", protect, getResumeById);
resumeRouter.get("/public/:resumeId", getPublicResume);

export default resumeRouter;
