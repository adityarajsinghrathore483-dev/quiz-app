const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const dotenv = require("dotenv");
const path = require("path");
const connectDB = require("./utils/db");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors({ origin: process.env.FRONTEND_URL || true }));
app.use(express.json());
app.use(morgan("dev"));

// Connect Database
connectDB();

// Routes
app.use("/api", require("./routes/auth"));
app.use("/api", require("./routes/quiz"));

// Serve frontend static files when deployed
const frontendDistPath = path.join(__dirname, "../frontend/dist");
app.use(express.static(frontendDistPath));

app.get("/", (req, res) => {
  if (process.env.NODE_ENV === "production") {
    return res.sendFile(path.join(frontendDistPath, "index.html"));
  }
  return res.send({ message: "Current Affairs Quiz API is running." });
});

// Handle client-side routes (React Router)
app.get("/*", (req, res) => {
  if (process.env.NODE_ENV === "production") {
    return res.sendFile(path.join(frontendDistPath, "index.html"));
  }
  res.status(404).json({ message: "Not Found" });
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ message: err.message || "Internal Server Error" });
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
