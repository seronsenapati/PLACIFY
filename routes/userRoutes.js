import express from "express";
import protect from "../middleware/authMiddleware.js";
import { getUserApplications } from "../controllers/userController.js";

const router = express.Router();

router.get("/:id/applications", protect, getUserApplications);

export default router;
