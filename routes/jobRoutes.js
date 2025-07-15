import express from "express";
import { createJob, getAllJobs } from "../controllers/jobController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, createJob);
router.get("/", getAllJobs);

export default router;
