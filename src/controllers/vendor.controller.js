const Vendor = require("../models/vendor.js");
const User = require("../models/user.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const SignUpVendor = async (req, res) => {
  try {
    const { fullName, email, storeName, storeImage, storeDescription, password } = req.body;

    // check if the email already exists in the regular users collection
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "User with this email already exists" });
    }

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
      let vendor = new Vendor({ fullName, email, storeName, storeImage, storeDescription, password: hashedPassword });
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
      // Generate JWT token with expiration time of 15 minutes
      const token = jwt.sign({ id: findVendor._id }, "passwordKey" , { expiresIn: '15m' });

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


const vendorTokenValidaty = async (req, res) => {
  try {
    const token = req.header('x-auth-token');
    if (!token) return res.json(false); // if no token, return false

    // verify token
    const verified = jwt.verify(token, 'passwordKey');
    if (!verified) return res.json(false); // if token is not verified, return false

    // check if vendor exists
    const vendor = await Vendor.findById(verified.id);
    if (!vendor) return res.json(false); // if vendor does not exist, return false

    return res.json(true); // if all checks pass, return true
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
    return res.json(false); // in case of error, return false
  }
};

const authenticateVendor = (req, res, next) => {
  try {
    // Retrieve vendor data from the database using the id from the authenticated user
    const vendor = Vendor.findById(req.user); // Exclude password field

    if (!vendor) {
      return res.status(404).json({ message: "Vendor not found" });
    }

    // send vendor data as json response , including all the vendor document fields and token except password
    res.status(200).json({ ...vendor._doc, token: req.token });
  } catch (error) {
    console.error(error);
    res.status(401).json({ message: "Token is not valid" });
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

const UpdateVendor = async (req, res) => {
  try {
    const { id } = req.params;
    const { storeImage, storeDescription } = req.body;
    const updatedVendor = await Vendor.findByIdAndUpdate(
      id,
      { storeImage, storeDescription },
      { new: true }
    );

    if (!updatedVendor) {
      return res.status(404).json({ error: "Vendor not found" }); // Vendor not found
    }

    res.status(200).json(updatedVendor);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  SignUpVendor,
  SignInVendor,
  vendorTokenValidaty,
  authenticateVendor,
  GetAllVendors,
  UpdateVendor,
};
