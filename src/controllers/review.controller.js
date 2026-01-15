const Product = require("../models/product.js");
const ProductReview = require("../models/product_review.js");

const createReview = async (req, res) => {
  try {
    const { buyerId, email, fullName, productId, rating, review } = req.body;

    if (!buyerId || !email || !fullName || !productId || !rating || !review) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // check if the user has already reviewed the product
    const existingReview = await ProductReview.findOne({ buyerId, productId });
    if (existingReview) {
      return res
        .status(400)
        .json({ message: "You have already reviewed this product" });
    }

    const newReview = new ProductReview({
      buyerId,
      email,
      fullName,
      productId,
      rating,
      review,
    });

    await newReview.save();

    // find the product and update its ratings
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // increment rating count and update average
    product.totalRatings += 1;
    product.averageRating =
      (product.averageRating * (product.totalRatings - 1) + rating) /
      product.totalRatings;

    await product.save();

    res.status(201).json(newReview);
  } catch (error) {
    console.error("Error creating product review:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// ✅ Fetch all reviews with populated data
// const getAllReviews = async (req, res) => {
//   try {
//     const reviews = await ProductReview.find()
//       .populate("buyerId", "fullName email") // Only get specific user fields
//       .populate("productId", "productName price averageRating");

//     res.status(200).json(reviews);
//   } catch (error) {
//     console.error("Error fetching product reviews:", error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// };

const getAllReviews = async (req, res) => {
  try {
    const reviews = await ProductReview.find();
    res.status(200).json(reviews);
  } catch (error) {
    console.error("Error fetching product reviews:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// ✅ Get all reviews for a specific product
const getReviewsByProduct = async (req, res) => {
  try {
    const { productId } = req.params;

    // check if productId is provided
    if (!productId) {
      return res.status(400).json({ message: "Product ID is required" });
    }

    // find all reviews that match the productId
    const reviews = await ProductReview.find({ productId })
      .populate("buyerId", "fullName email")
      .populate("productId", "productName price");

    // if no reviews found
    if (reviews.length === 0) {
      return res
        .status(404)
        .json({ message: "No reviews found for this product" });
    }

    res.status(200).json(reviews);
  } catch (error) {
    console.error("Error fetching reviews for product:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  createReview,
  getAllReviews,
  getReviewsByProduct, // ✅ add this line
};
