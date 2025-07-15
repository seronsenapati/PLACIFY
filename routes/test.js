import express from "express";
const router = express.Router();
import protect from "../middleware/authMiddleware.js";

router.get("/", (req, res) => {
  res.send("Test route is working!");
});

router.get("/secret", protect, (req, res) => {
  res
    .status(200)
    .json({ message: `hello ${req.user.email}, this is a protected route.` });
});

export default router;
