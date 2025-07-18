import express from "express";
import {
  createJob,
  getAllJobs,
  updateJob,
  deleteJob,
  getJobById,
} from "../controllers/jobController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

// Create a job
router.post("/", protect, createJob);

// Get all jobs
router.get("/", getAllJobs);

// Update a job
router.patch("/:id", protect, updateJob);

// Delete a job
router.delete("/:id", protect, deleteJob);

//get job by ID
router.get("/:id", getJobById);

export default router;
