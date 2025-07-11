const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const testRoutes = require("./routes/test");

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use("/api/test", testRoutes);

app.get("/", (req, res) => {
  res.send("Welcome to the Placify API!");
});

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
  });
});
