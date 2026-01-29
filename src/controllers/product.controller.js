const mongoose = require("mongoose");
const Product = require("../models/product.js");
const Vendor = require("../models/vendor.js");

const addProduct = async (req, res) => {
  try {
    const {
      productName,
      productPrice,
      quantity,
      description,
      category,
      vendorId,
      vendorFullName,
      subCategory,
      images,
    } = req.body;

    // Validate required fields
    if (
      !productName ||
      !productPrice ||
      !quantity ||
      !description ||
      !category ||
      !vendorId ||
      !vendorFullName ||
      !subCategory ||
      !images
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newProduct = new Product({
      productName,
      productPrice,
      quantity,
      description,
      category,
      vendorId,
      vendorFullName,
      subCategory,
      images,
    });

    await newProduct.save();
    res
      .status(201)
      .json({ message: "Product added successfully", product: newProduct });
  } catch (error) {
    res.status(500).json({ message: "Error adding product", error });
  }
};

const getPopularProducts = async (req, res) => {
  try {
    const popularProducts = await Product.find({ popular: true });
    if (!popularProducts || popularProducts.length === 0) {
      return res.status(404).json({ message: "No popular products found" });
    }
    // Assuming you want to limit the number of popular products returned
    // const popularProducts = await Product.find({ popular: true }).limit(10);
    // You can also sort them by some criteria, e.g., by price or rating
    // const popularProducts = await Product.find({ popular: true }).sort({ price: -1 }).limit(10);
    // Or you can use aggregation to get more complex data
    // const popularProducts = await Product.aggregate([
    //   { $match: { popular: true } },
    //   { $sort: { price: -1 } },
    //   { $limit: 10 },
    // ]);
    res.status(200).json({ popularProducts });
  } catch (error) {
    console.error("Error fetching popular products:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getRecommendedProducts = async (req, res) => {
  try {
    const recommendedProducts = await Product.find({ recommended: true });
    if (!recommendedProducts || recommendedProducts.length === 0) {
      return res.status(404).json({ message: "No recommended products found" });
    }
    res.status(200).json({ recommendedProducts });
  } catch (error) {
    console.error("Error fetching recommended products:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getProductsByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const products = await Product.find({ category, popular: true });

    if (!products || products.length == 0) {
      return res.status(400).json({ message: "Product not found" });
    } else {
      return res.status(200).json({ products });
    }
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

// new route for retrieving related product by category
const getRelatedProductsBySubCategory = async (req, res) => {
  try {
    const { productId } = req.params;
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    // find related products by subcategory of the current product
    const relatedProducts = await Product.find({
      subCategory: product.subCategory,
      _id: { $ne: productId },
    }); // Exclude the current product

    if (!relatedProducts || relatedProducts.length === 0) {
      return res.status(404).json({ message: "No related products found" });
    }

    res.status(200).json({ relatedProducts });
  } catch (error) {
    console.error("Error fetching related products:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

// fetch top 10 products highest rated products by rating
const getTopRatedProducts = async (req, res) => {
  try {
    // fetch all products and sort them by averagerating in decending order (highest to lowest rating)
    const topRatedProducts = await Product.find({})
      .sort({ averageRating: -1 })
      .limit(3); // sort by averageRating in descending order

    if (!topRatedProducts || topRatedProducts.length === 0) {
      return res.status(404).json({ message: "No top rated products found" });
    }

    res.status(200).json({ topRatedProducts });
  } catch (error) {
    console.error("Error fetching top rated products:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

// fetch products by subcategory
const productsBySubCategory = async (req, res) => {
  try {
    const { subCategory } = req.params;
    const productsBySubCategory = await Product.find({ subCategory });

    if (!productsBySubCategory || productsBySubCategory.length == 0) {
      return res.status(400).json({ message: "Product not found" });
    } else {
      return res.status(200).json({ productsBySubCategory });
    }
  } catch (error) {
    console.error("Error fetching products by subcategory:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

// method for search products by name or description
const searchProducts = async (req, res) => {
  try {
    // get query from request
    const { query } = req.query;
    // check if query is provided
    if (!query) {
      return res.status(400).json({ message: "Search query is required" });
    }
    // search products by name or description using regex and case insensitive
    const searchedProducts = await Product.find({
      $or: [
        { productName: { $regex: query, $options: "i" } },
        { description: { $regex: query, $options: "i" } },
        { category: { $regex: query, $options: "i" } },
      ],
    });
    // if no products found
    if (!searchedProducts || searchedProducts.length == 0) {
      return res
        .status(400)
        .json({ message: "No products found for the search query" });
    } else {
      return res.status(200).json({ searchedProducts });
    }
  } catch (error) {
    console.error("Error searching products:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

// method for edit an existing product
const editProduct = async (req, res) => {
  try {
    const { productId } = req.params;

    // ✅ MUST use findById
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // console.log("Vendor ID:", product.vendorId.toString());
    // console.log("Product ID:", productId);
    // console.log("Request User ID:", req.user.id);

    // ✅ ObjectId → string comparison
    if (product.vendorId.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ message: "You are not authorized to edit this product" });
    }

    // ❌ never allow vendorId update
    const { vendorId, ...productData } = req.body;

    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      { $set: productData },
      { new: true }
    );

    res.status(200).json({ updatedProduct });
  } catch (error) {
    console.error("Error editing product:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};


// method to fetch products by vendor id
const fetchVendorProducts = async (req, res) => {
  try {
    const { vendorId } = req.params;

    console.log("Vendor ID from URL:", vendorId);

    const products = await Product.find({ vendorId });

    console.log("Matched products:", products);

    if (products.length === 0) {
      return res.status(404).json({ message: "No products found for vendor" });
    }

    res.status(200).json(products );
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};


module.exports = {
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
};
