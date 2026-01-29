const express = require("express");
const mongoose = require("mongoose");
const userRouter = require("./routes/user");
const bannerRouter = require("./routes/banner");
const categoryRouter = require("./routes/category");
const subCategoryRouter = require("./routes/sub_category");
const productRouter = require("./routes/product");
const productReviewRouter = require("./routes/product_review");
const vendorRouter = require("./routes/vendor");
const orderRouter = require("./routes/order");
require("dotenv").config();
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");

// define PORT
const PORT = process.env.PORT || 3000;

const app = express();
// console.log(process.env.DATABASE_URL);


const DB = process.env.DATABASE_URL; // replace with your MongoDB URI
app.use(express.json());
app.use(cors()); // Enable CORS for all routes and origins
app.use(helmet());
app.use(morgan("common"));
app.use(userRouter);
app.use(bannerRouter);
app.use(categoryRouter);
app.use(subCategoryRouter);
app.use(productRouter);
app.use(productReviewRouter);
app.use(vendorRouter);
app.use(orderRouter);

app.get("/", (req, res) => {
  res.send("Hello World! Test Server is running...");
});

// Connect to MongoDB
mongoose
  .connect(DB)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error.message);
  });

app.listen(PORT, "0.0.0.0", () => {
  console.log("Server is running on port 3000");
});
