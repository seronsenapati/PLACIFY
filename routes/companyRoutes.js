import express from "express";
import {
  getAllCompanies,
  createCompany,
} from "../controllers/companyController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getAllCompanies);
router.post("/", protect, createCompany);

export default router;
