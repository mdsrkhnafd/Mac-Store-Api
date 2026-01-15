const express = require("express");
const {
  SignUpVendor,
  SignInVendor,
  GetAllVendors,
} = require("../controllers/vendor.controller");

const vendorRouter = express.Router();

// TODO: Vendor Signup api
vendorRouter.post("/api/vendor/signup", SignUpVendor);

// TODO: Vendor Signin api
vendorRouter.post("/api/vendor/signin", SignInVendor);

// fetch all vendors(excluding password)
vendorRouter.get("/api/vendors", GetAllVendors);

module.exports = vendorRouter;
