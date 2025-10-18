import ai from "../config/ai";
import Resume from "../models/Resume";

//POST api/ai/enhance-pro-sum
export const enhanceProfessionalSummary = async (req, res) => {
  try {
    const { userContent } = req.body;
    if (!userContent) {
      return res.status(400).json({ message: "missing required field" });
    }
    const response = await ai.chat.completions.create({
      model: process.env.OPENAI_MODEL,
      messages: [
        {
          role: "system",
          content: `You are an expert in resume writing.
             Your task is to enhance the professional summary of a resume.
              The summary should be 1-2 sentences also highlighting key skills,
               experience, and career objectives.
                Make it compelling and ATS-friendly.
                 and only return text no options or anything else.`,
        },
        {
          role: "user",
          content: userContent,
        },
      ],
    });
    const enhancedContent = response.choices[0].message.content;
    return res.json({ enhancedContent });
  } catch (error) {
    res.status(500).json({ message: error.message || "Server error" });
  }
};

//POST api/ai/enhance-job-desc
export const enhanceJobDescription = async (req, res) => {
  try {
    const { userContent } = req.body;
    if (!userContent) {
      return res.status(400).json({ message: "missing required field" });
    }
    const response = await ai.chat.completions.create({
      model: process.env.OPENAI_MODEL,
      messages: [
        {
          role: "system",
          content: `You are an expert in resume writing. 
          Your task is to enhance the job description of a resume.
           The job description should be only in 1-2 sentence 
           also highlighting key responsibilities and achievements.
            Use action verbs and quantifiable results where possible. 
            Make it ATS-friendly.
             and only return text no options or anything else.`,
        },
        {
          role: "user",
          content: userContent,
        },
      ],
    });
    const enhancedContent = response.choices[0].message.content;
    return res.json({ enhancedContent });
  } catch (error) {
    res.status(500).json({ message: error.message || "Server error" });
  }
};

//POST api/ai/upload-resume
export const uploadResume = async (req, res) => {
  try {
    const { resumeText, title } = req.body;
    const userId = req.userId;

    if (!resumeText) {
      return res.status(400).json({ message: "missing required field" });
    }
    const systemPrompt =
      "You are an expert AI Agent to extract data from resume.";

    const userPrompt = `Extract data from this resume: ${resumeText}`;

    const response = await ai.chat.completions.create({
      model: process.env.OPENAI_MODEL,
      messages: [
        {
          role: "system",
          content: systemPrompt,
        },
        {
          role: "user",
          content: userPrompt,
        },
      ],
      response_format: { type: "json_object" },
    });
    const extractedData = response.choices[0].message.content;
    const parsedData = JSON.parse(extractedData);
    const newResume = await Resume.create({ userId, title, ...parsedData });

    return res.json({ resumeId: newResume._id });
  } catch (error) {
    res.status(500).json({ message: error.message || "Server error" });
  }
};
