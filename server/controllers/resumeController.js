import Resume from "../models/Resume.js";
import imageKit from "../config/imageKit.js";
import fs from "fs";

// POST /api/resumes/create
export const createResume = async (req, res) => {
  try {
    const userId = req.userId;
    const { title } = req.body;

    const newResume = await Resume.create({ userId, title });
    return res.status(201).json({
      message: "resume has been created successfully",
      resume: newResume,
    });
  } catch (error) {
    res.status(500).json({ message: error.message || "Server error" });
  }
};

// POST /api/resumes/delete
export const deleteResume = async (req, res) => {
  try {
    const userId = req.userId;
    const { resumeId } = req.params;

    await Resume.findOneAndDelete({ userId, _id: resumeId });
    return res
      .status(200)
      .json({ message: "resume has been deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message || "Server error" });
  }
};

// POST /api/resumes/get
export const getResumeById = async (req, res) => {
  try {
    const userId = req.userId;
    const { resumeId } = req.params;

    const resume = await Resume.findOne(
      { userId, _id: resumeId },
      { __v: 0, createdAt: 0, updatedAt: 0 }
    );

    if (!resume) {
      return res.status(404).json({ message: "Resume not found" });
    }
    return res.status(200).json({ resume });
  } catch (error) {
    res.status(500).json({ message: error.message || "Server error" });
  }
};

// GET /api/resumes/public
export const getPublicResume = async (req, res) => {
  try {
    const { resumeId } = req.params;
    const resume = await Resume.findOne({ public: true, _id: resumeId });
    if (!resume) {
      return res.status(404).json({ message: "Resume not found" });
    }
    res.status(200).json({ resume });
  } catch (error) {
    res.status(500).json({ message: error.message || "Server error" });
  }
};

// PUT /api/resumes/update
export const updateResume = async (req, res) => {
  try {
    const userId = req.userId;
    const { resumeId, resumeData, removeBackground } = req.body;
    const image = req.file;

    let resumeDataCopy;
    if (typeof resumeData === "string") {
      resumeDataCopy = await JSON.parse(resumeData);
    } else {
      resumeDataCopy = structuredClone(resumeData);
    }

    if (image) {
      const response = await imageKit.files.upload({
        file: fs.createReadStream(image.path),
        fileName: "resume.png",
        folder: "user-resumes",
        transformation: {
          pre:
            "w-300,h-300,fo-face,z-0.75" +
            (removeBackground ? ",e-bgremove" : ""),
        },
      });
      fs.unlinkSync(image.path);
      resumeDataCopy.personal_info.image = response.url;
    }

    const updatedResume = await Resume.findOneAndUpdate(
      {
        userId,
        _id: resumeId,
      },
      resumeDataCopy,
      { new: true }
    );

    if (!updatedResume)
      return res.status(404).json({ message: "Resume not found" });

    return res.status(200).json({
      message: "resume has been updated successfully",
      resume: updatedResume,
    });
  } catch (error) {
    res.status(500).json({ message: error.message || "Server error" });
  }
};
