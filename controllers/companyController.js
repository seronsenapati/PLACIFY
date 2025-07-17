// controllers/companyController.js
import Company from "../models/Company.js";

// POST - Create a new company
export const createCompany = async (req, res) => {
  try {
    if (req.user.role !== "recruiter") {
      return res
        .status(403)
        .json({ message: "Only recruiters can post companies" });
    }
    const { name, desc, website } = req.body;

    if (!name || !desc || !website) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const company = await Company.create({
      name,
      desc,
      website,
    });

    res.status(201).json({
      message: "Company created successfully",
      company,
    });
  } catch (error) {
    console.error("Company Create Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// GET - Fetch all companies with their jobs
export const getAllCompanies = async (req, res) => {
  try {
    const companies = await Company.find()
      .populate("jobs", "title location salary") // Populate key job fields only
      .sort({ createdAt: -1 });

    res.status(200).json({
      message: "Companies fetched successfully",
      companies,
    });
  } catch (error) {
    console.error("Company Fetch Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
