import Job from "../models/job.js";

export const createJob = async (req, res) => {
  try {
    const { title, desc, location, salary } = req.body;

    if (!title || !desc || !location || !salary) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newJob = await Job.create({
      title,
      desc,
      location,
      salary,
      createdBy: req.user.id,
    });

    res.status(201).json({
      message: "Job created successfully",
      job: newJob,
    });
  } catch (error) {
    console.error("Job Creation Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getAllJobs = async (req, res) => {
  try {
    const jobs = await Job.find().populate("createdBy", "name email");

    res.status(200).json({ message: "Jobs fetched successfully", jobs });
  } catch (error) {
    console.error("Job Fetch Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};
