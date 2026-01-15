const Category = require("../models/Category.js");

const createCategory = async (req, res) => {
  try {
    const { name, image, banner } = req.body;
    if (!name || !image || !banner) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const newCategory = new Category({ name, image, banner });
    await newCategory.save();
    res.status(201).json({
      message: "Category created successfully",
      category: newCategory,
    });
  } catch (error) {
    console.error("Error creating category:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.status(200).json({ categories });
  } catch (error) {
    console.error("Error fetching categories:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = { createCategory, getAllCategories };
