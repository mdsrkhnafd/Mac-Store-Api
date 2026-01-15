const express = require("express");
const bannerRouter = express.Router();
const {
  createBanner,
  getBanners,
} = require("../controllers/banner.controller");

bannerRouter.post("/api/banner", createBanner);

bannerRouter.get("/api/banner", getBanners);

module.exports = bannerRouter;
