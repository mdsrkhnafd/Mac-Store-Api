const express = require("express");
const {auth , vendorAuth} = require("../middleware/auth.js")
const {
  addProduct,
  getPopularProducts,
  getRecommendedProducts,
  getProductsByCategory,
  getRelatedProductsBySubCategory,
  getTopRatedProducts,
  productsBySubCategory,
  searchProducts,
  fetchVendorProducts,
  editProduct,
} = require("../controllers/product.controller.js");

const productRouter = express.Router();

// add new product
productRouter.post("/api/add-product",auth , vendorAuth, addProduct);
// fetch popular products
productRouter.get("/api/popular-products", getPopularProducts);
// fetch recommended products
productRouter.get("/api/recommended-products", getRecommendedProducts);
// fetch products by category
productRouter.get("/api/products-by-category/:category", getProductsByCategory);
// fetch related products by subcategory
productRouter.get("/api/related-products-by-subcategory/:productId" , getRelatedProductsBySubCategory);
// fetch top 10 products highest rated products by rating
productRouter.get("/api/top-rated-products", getTopRatedProducts);
// fetch products by subcategory
productRouter.get("/api/products-by-subcategory/:subCategory", productsBySubCategory);
// search products by name or description
productRouter.get("/api/search-products", searchProducts);
// fetch products by vendor and allow vendor to edit their products
productRouter.get("/api/products/vendor/:vendorId" , fetchVendorProducts);
// edit product
productRouter.put("/api/edit-product/:productId",auth , vendorAuth, editProduct);

module.exports = productRouter;
