const jwt = require("jsonwebtoken");
const User = require("../models/user.js");
const Vendor = require("../models/vendor.js");

// authentication middleware
// verifies JWT token and attaches user to request object
const auth = async (req, res, next) => {
  try {
    const token = req.header("x-auth-token");

    if (!token) {
      return res
        .status(401)
        .json({ message: "No Authentication token, authorization denied" });
    }

    const verified = jwt.verify(token, "passwordKey");
    if (!verified) {
      return res
        .status(401)
        .json({ message: "Token verification failed, authorization denied" });
    }

    const user =
      (await User.findById(verified.id)) ||
      (await Vendor.findById(verified.id));

    if (!user) {
      return res
        .status(401)
        .json({ message: "User or Vendor not found, authorization denied" });
    }

    req.user = user;
    req.token = token;

    // proceed to next middleware or route handler
    next();
  } catch (err) {
    console.error("Authentication error:", err.message);
    res.status(401).json({ message: "Unauthorized" });
  }
};

// Vendor authentication middleware
// this ensures that the authenticated user is a Vendor
// it should be used for routes that require Vendor access
const vendorAuth = (req, res, next) => {
  // check if req.user is a Vendor (by checking role or model type as per your implementation)

  try {
    // assuming req.user has a role property
    if (req.user && req.user.role === "vendor") {
      next();
    } else {
      // if not a vendor, deny access
      return res
        .status(403)
        .json({ message: "Access denied, only vendor authorization required" });
    }
  } catch (error) {
    console.error("Vendor authorization error:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = { auth, vendorAuth };
