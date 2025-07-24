import Job from "../models/Job.js";
import sendResponse from "../utils/sendResponse.js";
import validateFields from "../utils/validateFields.js";
import { validateJobFields } from "../utils/validateAdvancedFields.js";
import Application from "../models/Application.js";

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
    if (req.user?.role === "recruiter") {
      jobs = await Job.find({ createdBy: req.user.id }).populate(
        "createdBy",
        "name email"
      );
    }

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

//Apply for a Job
export const applyToJob = async (req, res) => {
  try {
    if (req.user.role !== "student") {
      return sendResponse(res, 403, false, "Only students can apply for jobs");
    }

    const { jobId } = req.params;

    const job = await Job.findById(jobId);
    if (!job) {
      return sendResponse(res, 404, false, "Job not found");
    }

    const alreadyApplied = await Application.findOne({
      job: jobId,
      applicant: req.user.id,
    });

    if (alreadyApplied) {
      return sendResponse(
        res,
        400,
        false,
        "You have already applied to this job"
      );
    }

    const application = await Application.create({
      job: jobId,
      applicant: req.user.id,
    });

    return sendResponse(
      res,
      201,
      true,
      "Application submitted successfully",
      application
    );
  } catch (error) {
    console.error("Job Application Error:", error);
    return sendResponse(res, 500, false, "Server error");
  }
};
