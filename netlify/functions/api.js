const express = require("express");
const mongoose = require("mongoose");
const serverless = require("serverless-http");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
require("dotenv").config();

// IMPORTANT: Update these paths to point to your actual routes folder
// Since this file is in netlify/functions, we go up TWO levels (../../) to find src
const userRouter = require("../../src/routes/user");
const bannerRouter = require("../../src/routes/banner");
const categoryRouter = require("../../src/routes/category");
const subCategoryRouter = require("../../src/routes/sub_category");
const productRouter = require("../../src/routes/product");
const productReviewRouter = require("../../src/routes/product_review");
const vendorRouter = require("../../src/routes/vendor");
const orderRouter = require("../../src/routes/order");

const app = express();
const DB = process.env.DATABASE_URL;

// Middleware
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan("common"));

// 1. Database Connection Logic (Serverless optimized)
let isConnected = false;
const connectDB = async () => {
  if (isConnected) return;
  try {
    await mongoose.connect(DB, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    isConnected = true;
    console.log("Connected to MongoDB");
  } catch (err) {
    console.error("MongoDB connection error:", err);
  }
};

// 2. Define a Router
const router = express.Router();

router.get("/", (req, res) => {
  res.send("Hello World! Netlify API is running...");
});

// Attach your existing routes to this router
router.use(userRouter);
router.use(bannerRouter);
router.use(categoryRouter);
router.use(subCategoryRouter);
router.use(productRouter);
router.use(productReviewRouter);
router.use(vendorRouter);
router.use(orderRouter);

// 3. IMPORTANT: Set the base path for Netlify Functions
app.use("/.netlify/functions/api", router);

// 4. Export the handler
const handler = serverless(app);
module.exports.handler = async (event, context) => {
  // This allows the database connection to stay open for future requests
  context.callbackWaitsForEmptyEventLoop = false;
  await connectDB();
  return await handler(event, context);
};
