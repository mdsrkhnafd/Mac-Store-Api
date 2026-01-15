const express = require("express");
const {
  createCategory,
  getAllCategories,
} = require("../controllers/category..controller.js");

const categoryRouter = express.Router();

categoryRouter.post("/api/categories", createCategory);

categoryRouter.get("/api/categories", getAllCategories);

module.exports = categoryRouter;
