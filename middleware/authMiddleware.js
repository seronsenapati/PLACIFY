import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const protect = (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res
        .status(401)
        .json({ message: "No token, authorization denied" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded;
    
    next();
  } catch (error) {
    console.log("JWT Error: ", error);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

export default protect;
