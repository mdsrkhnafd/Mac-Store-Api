const express = require("express");
const {
  createSubCategory,
  getSubCategoriesByCategoryName,
  getAllSubCategories,
} = require("../controllers/sub_category.controller.js");

const subCategoryRouter = express.Router();

subCategoryRouter.post("/api/subcategories", createSubCategory);

// get categories by categoryName
subCategoryRouter.get(
  "/api/category/:categoryName/subcategories",
  getSubCategoriesByCategoryName
);

subCategoryRouter.get("/api/subcategories", getAllSubCategories);

module.exports = subCategoryRouter;
