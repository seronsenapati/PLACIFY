import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import sendResponse from "../utils/sendResponse.js";

dotenv.config();

const protect = (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return sendResponse(res, 401, false, "No token, authorization denied");
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded;
    next();
  } catch (error) {
    console.log("JWT Error: ", error);
    return sendResponse(res, 401, false, "Invalid or expired token");
  }
};

export default protect;
