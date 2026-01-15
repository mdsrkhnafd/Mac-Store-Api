const Banner = require("../models/banner");

const createBanner = async (req, res) => {
  try {
    const { image } = req.body;
    if (!image) {
      return res.status(400).json({ message: "Image URL is required" });
    }

    const banner = new Banner({ image });
    await banner.save();
    res.status(201).json({ message: "Banner created successfully", banner });
  } catch (error) {
    console.error("Error creating banner:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getBanners = async (req, res) => {
  try {
    const banners = await Banner.find();
    res.status(200).json({ banners });
  } catch (error) {
    console.error("Error fetching banners:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = { createBanner, getBanners };
