import Job from "../models/Job.js";
import sendResponse from "../utils/sendResponse.js";
import validateFields from "../utils/validateFields.js";
import { validateJobFields } from "../utils/validateAdvancedFields.js";

//Create job
export const createJob = async (req, res) => {
  try {
    const { isValid, missingFields } = validateFields(
      ["title", "role", "desc", "location", "salary"],
      req.body
    );

    if (!isValid) {
      return sendResponse(
        res,
        400,
        false,
        `Missing required fields: ${missingFields.join(", ")}`
      );
    }

    const { role, desc, salary } = req.body;

    const fieldErrors = validateJobFields({ role, desc, salary });
    if (fieldErrors.length > 0) {
      return sendResponse(res, 400, false, fieldErrors.join(", "));
    }

    const { title, location } = req.body;
    const newJob = await Job.create({
      title,
      role,
      desc,
      location,
      salary,
      createdBy: req.user.id,
    });

    return sendResponse(res, 201, true, "Job created successfully", newJob);
  } catch (error) {
    console.error("Job Creation Error:", error);
    return sendResponse(res, 500, false, "Server error");
  }
};

//Get All Jobs
export const getAllJobs = async (req, res) => {
  try {
    const jobs = await Job.find().populate("createdBy", "name email");

    return sendResponse(res, 200, true, "Jobs fetched successfully", jobs);
  } catch (error) {
    console.error("Job Fetch Error:", error);
    return sendResponse(res, 500, false, "Server Error");
  }
};

//Updated a Job
export const updateJob = async (req, res) => {
  try {
    const jobId = req.params.id;
    const job = await Job.findById(jobId);

    if (!job) {
      return sendResponse(res, 404, false, "Job not found");
    }

    if (job.createdBy.toString() !== req.user.id) {
      return sendResponse(res, 403, false, "Not authorized to update this job");
    }

    const updatedJob = await Job.findByIdAndUpdate(jobId, req.body, {
      new: true,
      runValidators: true,
    });

    return sendResponse(res, 200, true, "Job updated successfully", updatedJob);
  } catch (error) {
    console.error("Job Update Error:", error);
    return sendResponse(res, 500, false, "Server error");
  }
};

// Delete Job
export const deleteJob = async (req, res) => {
  try {
    const jobId = req.params.id;
    const job = await Job.findById(jobId);

    if (!job) {
      return sendResponse(res, 404, false, "Job not found");
    }

    if (job.createdBy.toString() !== req.user.id) {
      return sendResponse(res, 403, false, "Not authorized to delete this job");
    }

    await Job.findByIdAndDelete(jobId);

    return sendResponse(res, 200, true, "Job deleted successfully");
  } catch (error) {
    console.error("Job Deletion Error:", error);
    return sendResponse(res, 500, false, "Server error");
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
      return sendResponse(res, 404, false, "Job not found");
    }

    return sendResponse(res, 200, true, "Job fetched successfully", job);
  } catch (error) {
    console.error("Get Job By ID Error:", error);

    // Handle invalid ObjectId errors
    if (error.name === "CastError") {
      return sendResponse(res, 400, false, "Invalid job ID");
    }

    return sendResponse(res, 500, false, "Server error");
  }
};
