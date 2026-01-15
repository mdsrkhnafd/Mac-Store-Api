const Vendor = require("../models/vendor.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const SignUpVendor = async (req, res) => {
  try {
    const { fullName, email, password } = req.body;

    const existingEmail = await Vendor.findOne({ email });
    if (existingEmail) {
      return res
        .status(400)
        .json({ message: "Vendor with this email already exists" });
    }
    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters long" });
    } else {
      // Hash the password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      let vendor = new Vendor({ fullName, email, password: hashedPassword });
      vendor = await vendor.save();
      res.status(201).json({ message: "Vendor created successfully", vendor });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

const SignInVendor = async (req, res) => {
  try {
    const { email, password } = req.body;
    const findVendor = await Vendor.findOne({ email });
    if (!findVendor) {
      return res
        .status(404)
        .json({ message: "Vendor not found with this email" });
    }

    // Compare the password with the hashed password
    const isMatch = await bcrypt.compare(password, findVendor.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    } else {
      // Generate JWT token
      const token = jwt.sign({ id: findVendor._id }, "passwordKey");

      // Remove password from vendor object - like this: { password: "hashedPassword" }
      const { password, ...vendorWithoutPassword } = findVendor._doc;

      // Return the response
      res.status(200).json({ token, vendor: vendorWithoutPassword });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

const GetAllVendors = async (req, res) => {
  try {
    const vendors = await Vendor.find({}, { password: 0 });
    res.status(200).json(vendors);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  SignUpVendor,
  SignInVendor,
  GetAllVendors,
};
