const express = require("express");
const mongoose = require("mongoose");
const serverless = require("serverless-http");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
require("dotenv").config();

// Paths to your existing routes
const userRouter = require("../../src/routes/user");
const bannerRouter = require("../../src/routes/banner");
const categoryRouter = require("../../src/routes/category");
const subCategoryRouter = require("../../src/routes/sub_category");
const productRouter = require("../../src/routes/product");
const productReviewRouter = require("../../src/routes/product_review");
const vendorRouter = require("../../src/routes/vendor");
const orderRouter = require("../../src/routes/order");

const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan("common"));

// Database Connection Logic
let isConnected = false;
const connectDB = async () => {
  if (isConnected) return;
  try {
    // Using process.env directly ensures Netlify picks up the dashboard variable
    await mongoose.connect(process.env.DATABASE_URL);
    isConnected = true;
    console.log("Connected to MongoDB");
  } catch (err) {
    console.error("MongoDB connection error:", err);
  }
};

const router = express.Router();

// This matches the root URL
router.get("/", (req, res) => {
  res.send("<h1>API is running</h1>");
});

// Attach your routers
router.use(userRouter);
router.use(bannerRouter);
router.use(categoryRouter);
router.use(subCategoryRouter);
router.use(productRouter);
router.use(productReviewRouter);
router.use(vendorRouter);
router.use(orderRouter);

// CRITICAL FIX: Mount at "/"
// Since your routes (like userRouter) already start with "/api"
app.use("/", router);

const handler = serverless(app);

module.exports.handler = async (event, context) => {
  // Keeps the DB connection alive across multiple function calls
  context.callbackWaitsForEmptyEventLoop = false;
  await connectDB();
  return await handler(event, context);
};
