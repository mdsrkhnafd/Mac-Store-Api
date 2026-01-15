const SubCategory = require("../models/sub_category.js");

const createSubCategory = async (req, res) => {
  try {
    const { categoryId, categoryName, image, subCategoryName } = req.body;
    if (!categoryId || !categoryName || !image || !subCategoryName) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const newSubCategory = new SubCategory({
      categoryId,
      categoryName,
      image,
      subCategoryName,
    });
    await newSubCategory.save();
    res.status(201).json({
      message: "SubCategory created successfully",
      subCategory: newSubCategory,
    });
  } catch (error) {
    console.error("Error creating SubCategory:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getSubCategoriesByCategoryName = async (req, res) => {
  try {
    // Extract categoryName from the request URL using destructuring
    const { categoryName } = req.params;

    // Check if categoryName is not provided or is an empty string
    if (!categoryName || categoryName.trim() === "") {
      return res.status(400).json({ error: "categoryName is required" });
    }

    // Fetch subcategories for the provided categoryName
    const subCategories = await SubCategory.find({
      categoryName: categoryName,
    });

    // Check if any subcategories were found
    if (!subCategories || subCategories.length === 0) {
      // Return 404 error if no subcategories were found
      return res.status(404).json({ msg: "No subcategories found" });
    }

    // Return 200 status code with the subCategories
    res.status(200).json({ subCategories });
  } catch (error) {
    console.error("Error fetching SubCategories:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getAllSubCategories = async (req, res) => {
  try {
    const subCategories = await SubCategory.find();
    res.status(200).json({ subCategories });
  } catch (error) {
    console.error("Error fetching SubCategories:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  createSubCategory,
  getSubCategoriesByCategoryName,
  getAllSubCategories,
};
