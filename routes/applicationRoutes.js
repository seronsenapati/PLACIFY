import express from "express";
import { getStudentApplications } from "../controllers/getStudentApplications.js";
import { getJobApplications } from "../controllers/getJobApplications.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/student", protect, getStudentApplications);
router.get("/job/:id", protect, getJobApplications);

export default router;
