import Company from "../models/Company.js";
import sendResponse from "../utils/sendResponse.js";

// POST - Create a new company
export const createCompany = async (req, res) => {
  try {
    if (req.user.role !== "recruiter") {
      return sendResponse(res, 403, false, "Only recruiters can post companies");
    }
    const { name, desc, website } = req.body;

    if (!name || !desc || !website) {
      return sendResponse(res, 400, false, "All fields are required");
    }

    const company = await Company.create({
      name,
      desc,
      website,
    });

    return sendResponse(res, 201, true, "Company created successfully", company);
  } catch (error) {
    console.error("Company Create Error:", error);
    return sendResponse(res, 500, false, "Server error");
  }
};

// GET - Fetch all companies with their jobs
export const getAllCompanies = async (req, res) => {
  try {
    const companies = await Company.find()
      .populate("jobs", "title location salary") // Populate key job fields only
      .sort({ createdAt: -1 });

    return sendResponse(res, 200, true, "Companies fetched successfully", companies);
  } catch (error) {
    console.error("Company Fetch Error:", error);
    return sendResponse(res, 500, false, "Server error");
  }
};
