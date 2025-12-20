const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// ✅ CORS FIX
const allowedOrigins = [
  "https://rr-products-ux86.vercel.app",
  "http://localhost:3000",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

app.use(express.json());

// Routes
const productRoutes = require("./routes/products");
const authRoutes = require("./routes/auth");
const uploadRoutes = require("./routes/uploads");

// Static uploads
app.use("/uploads", express.static(path.join(__dirname, "..", "uploads")));

app.use("/api/products", productRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/uploads", uploadRoutes);

// Health routes
app.get("/", (req, res) =>
  res.send("RR Products Manufacturing - Stock Management API")
);

app.get("/api", (req, res) =>
  res.json({
    message: "RR Products Manufacturing API",
    version: "1.0.0",
    endpoints: {
      products: "/api/products",
      auth: "/api/auth",
      uploads: "/api/uploads",
    },
  })
);

// Start server
const start = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      console.warn(
        "[server] MONGODB_URI is not set. Database operations may fail."
      );
    } else {
      await mongoose.connect(process.env.MONGODB_URI);
      console.log("[server] Connected to MongoDB");
    }
  } catch (err) {
    console.error("[server] MongoDB connection error:", err.message);
  }

  app.listen(PORT, () => {
    console.log(`[server] API listening on port ${PORT}`);
  });
};

start();
