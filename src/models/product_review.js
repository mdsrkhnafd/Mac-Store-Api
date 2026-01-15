const mongoose = require("mongoose");

const productReviewSchema = new mongoose.Schema({
  buyerId: {
    type: mongoose.Schema.Types.ObjectId, // ✅ Change from String
    ref: "User", // 👈 Refers to User model
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  fullName: {
    type: String,
    required: true,
  },
  productId: {
    type: mongoose.Schema.Types.ObjectId, // ✅ Change from String
    ref: "Product", // 👈 Refers to Product model
    required: true,
  },
  rating: {
    type: Number,
    required: true,
  },
  review: {
    type: String,
    required: true,
  },
});

const ProductReview = mongoose.model("ProductReview", productReviewSchema);
module.exports = ProductReview;
