const express = require("express");
const mongoose = require("mongoose");
const serverless = require("serverless-http");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
require("dotenv").config();

// Import your routers
const userRouter = require("./routes/user");
const bannerRouter = require("./routes/banner");
const categoryRouter = require("./routes/category");
const subCategoryRouter = require("./routes/sub_category");
const productRouter = require("./routes/product");
const productReviewRouter = require("./routes/product_review");
const vendorRouter = require("./routes/vendor");
const orderRouter = require("./routes/order");

const app = express();
const DB = process.env.DATABASE_URL;

// Middleware
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan("common"));

// Database Connection (Serverless optimized)
let cachedDb = null;
const connectDB = async () => {
  if (cachedDb) return;
  try {
    cachedDb = await mongoose.connect(DB);
    console.log("Connected to MongoDB");
  } catch (err) {
    console.error("DB Connection Error:", err.message);
  }
};

// Route definitions (MUST prefix with your function path for local testing)
const router = express.Router();
router.get("/", (req, res) => res.send("API is running..."));
router.use(userRouter);
router.use(bannerRouter);
router.use(categoryRouter);
router.use(subCategoryRouter);
router.use(productRouter);
router.use(productReviewRouter);
router.use(vendorRouter);
router.use(orderRouter);

// Apply router with the base path Netlify expects
app.use("/.netlify/functions/api", router);

// Export as serverless handler
const handler = serverless(app);
module.exports.handler = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;
  await connectDB();
  return await handler(event, context);
};
