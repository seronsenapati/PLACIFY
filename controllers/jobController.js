import Job from "../models/Job.js";

//Create job
export const createJob = async (req, res) => {
  try {
    const { title, role, desc, location, salary } = req.body;

    if (!title || !role || !desc || !location || !salary) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newJob = await Job.create({
      title,
      role,
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

//Get All Jobs
export const getAllJobs = async (req, res) => {
  try {
    const jobs = await Job.find().populate("createdBy", "name email");

    res.status(200).json({ message: "Jobs fetched successfully", jobs });
  } catch (error) {
    console.error("Job Fetch Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

//Updated a Job
export const updateJob = async (req, res) => {
  try {
    const jobId = req.params.id;
    const job = await Job.findById(jobId);

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    if (job.createdBy.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ message: "Not authorized to update this job" });
    }

    const updatedJob = await Job.findByIdAndUpdate(jobId, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      message: "Job updated successfully",
      job: updatedJob,
    });
  } catch (error) {
    console.error("Job Update Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete Job
export const deleteJob = async (req, res) => {
  try {
    const jobId = req.params.id;
    const job = await Job.findById(jobId);

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    if (job.createdBy.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this job" });
    }

    await Job.findByIdAndDelete(jobId);

    res.status(200).json({ message: "Job deleted successfully" });
  } catch (error) {
    console.error("Job Deletion Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

//Get Job by ID
export const getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).populate(
      "createdBy",
      "name email role"
    );

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    res.status(200).json({ message: "Job fetched successfully", job });
  } catch (error) {
    console.error("Get Job By ID Error:", error);

    // Handle invalid ObjectId errors
    if (error.name === "CastError") {
      return res.status(400).json({ message: "Invalid job ID" });
    }

    res.status(500).json({ message: "Server error" });
  }
};
