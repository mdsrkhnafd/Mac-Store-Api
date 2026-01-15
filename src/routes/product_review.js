const express = require("express");
const {
  createReview,
  getAllReviews,
  getReviewsByProduct,
} = require("../controllers/review.controller.js");
const productReviewRouter = express.Router();

// Create a new product review
productReviewRouter.post("/api/product-review", createReview);

// Get all product reviews
productReviewRouter.get("/api/reviews", getAllReviews);

// get reviews by product ID
productReviewRouter.get("/api/reviews/:productId", getReviewsByProduct); // ✅ new route

module.exports = productReviewRouter;
