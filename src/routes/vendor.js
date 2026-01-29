const express = require("express");
const {auth} = require("../middleware/auth.js");

const {
  SignUpVendor,
  SignInVendor,
  vendorTokenValidaty,
  authenticateVendor,
  GetAllVendors,
  UpdateVendor,
} = require("../controllers/vendor.controller");

const vendorRouter = express.Router();

// TODO: Vendor Signup api
vendorRouter.post("/api/v2/vendor/signup", SignUpVendor);

// TODO: Vendor Signin api
vendorRouter.post("/api/v2/vendor/signin", SignInVendor);

// TODO: Vendor token validity check api
vendorRouter.post("/vendor-tokenIsValid", vendorTokenValidaty);

// TODO: Vendor authenticate user api
vendorRouter.get("/get-vendor", auth, authenticateVendor);

// fetch all vendors(excluding password)
vendorRouter.get("/api/vendors", GetAllVendors);

// update vendor info
vendorRouter.put("/api/vendor/:id", UpdateVendor);


module.exports = vendorRouter;
