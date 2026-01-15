const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  productName: { type: String, required: true, trim: true },
  productPrice: { type: Number, required: true },
  quantity: { type: Number, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  vendorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Vendor",
    required: true,
  },
  vendorFullName: { type: String, required: true },
  subCategory: { type: String, required: true },
  images: [{ type: String, required: true }],
  popular: { type: Boolean, default: true },
  recommended: { type: Boolean, default: false },
  averageRating: { type: Number, default: 0 },
  totalRatings: { type: Number, default: 0 },
});

const Product = mongoose.model("Product", productSchema);
module.exports = Product;
