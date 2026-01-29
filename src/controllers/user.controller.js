const User = require("../models/user.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const sendOtpEmail = require("../helper/send_email.js");
const crypto = require("crypto");
const Vendor = require("../models/vendor.js");

const optStore = new Map();
const SignUp = async (req, res) => {
  try {
    const { fullName, email, password } = req.body;

    // check if the email already exists in the vendors collection
    const existingVendor = await Vendor.findOne({ email });
    if (existingVendor) {
      return res
        .status(400)
        .json({ message: "Vendor with this email already exists" });
    }

    // check if the email already exists in the users collection
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "User with this email already exists" });
    }

    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res
        .status(400)
        .json({ message: "User with this email already exists" });
    }
    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters long" });
    } else {
      // Hash the password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      // Generate OTP
      const otp = crypto.randomInt(100000, 999999).toString();
      // Save OTP to in-memory store
      optStore.set(email, { otp, expiresAt: Date.now() + 10 * 60 * 1000 }); // OTP valid for 10 minutes
      // Create new user
      let user = new User({ fullName, email, password: hashedPassword , isVerified: false});
      user = await user.save();
      // Send Welcome Email
      /// TODO: enable email sending
      const emailResponse = await sendOtpEmail(email, otp);
      res.status(201).json({ message: "Signup successful. OTP send to your email. Please verify", emailResponse });
      
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

const SignIn = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log("Received email:", email); // Debugging log
    const findUser = await User.findOne({ email });
    console.log("Found user:", findUser); // Debugging log

    if (!findUser) {
      return res
        .status(404)
        .json({ message: "User not found with this email" });
    }

    // check if user is verified
    if (!findUser.isVerified) {
      return res
        .status(401)
        .json({ message: "Email is not verified. Please verify your email to sign in." });
    }
    else {
      const isMatch = await bcrypt.compare(password, findUser.password);
      if (!isMatch) {
        return res.status(400).json({ message: "Invalid credentials" });
      } else {
        // Generate JWT token with expiration time of 15 minutes
        const token = jwt.sign({ id: findUser._id }, "passwordKey" , { expiresIn: '15m' });
        // remove password from user object before sending response
        const { password, ...userWithoutPassword } = findUser._doc;
        // send token in response
        res.status(200).json({ token,user: userWithoutPassword });
      }
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

const authenticateUser = (req, res, next) => {
  try {
    // Retrieve user data from the database using the id from the authenticated user
    const user = User.findById(req.user); // Exclude password field

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // send user data as json response , including all the user document fields and token except password
    res.status(200).json({ ...user._doc, token: req.token });
  } catch (error) {
    console.error(error);
    res.status(401).json({ message: "Token is not valid" });
  }
};

const tokenValidaty = async (req, res) => {
  try {
    const token = req.header('x-auth-token');
    if (!token) return res.json(false); // if no token, return false

    // verify token
    const verified = jwt.verify(token, 'passwordKey');
    if (!verified) return res.json(false); // if token is not verified, return false

    // check if user exists
    const user = await User.findById(verified.id);
    if (!user) return res.json(false); // if user does not exist, return false

    return res.json(true); // if all checks pass, return true
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
    return res.json(false); // in case of error, return false
  }
};

const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    // check if OTP exists for the email and is valid
    const storedOtpData = optStore.get(email);
    if (
      !storedOtpData ||
      storedOtpData.otp !== otp ||
      storedOtpData.expiresAt < Date.now()
    ) {
      optStore.delete(email); // remove expired or invalid OTP
      return res.status(400).json({ message: "Invalid OTP or expired OTP" });
    }

    // update user's isVerified field to true
    const user = await User.findOneAndUpdate(
      { email },
      { isVerified: true },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // remove OTP from store after successful verification
    optStore.delete(email);

    res.status(200).json({ message: "Email verified successfully" , user });// Compare the password with the hashed password
    const isMatch = await bcrypt.compare(password, findUser.password);
    console.log("Password match:", isMatch); // Debugging log
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    } else {
      // Generate a JWT token
      const token = jwt.sign({ id: findUser._id }, "passwordKey");

      // Remove password from user object
      const { password, ...userWithoutPassword } = findUser._doc;

      // Return the response
      res.status(200).json({ token, user: userWithoutPassword });
    }

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

const resendOtp = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    // Generate OTP
      const otp = crypto.randomInt(100000, 999999).toString();
      // Save OTP to in-memory store
      optStore.set(email, { otp, expiresAt: Date.now() + 10 * 60 * 1000 }); // OTP valid for 10 minutes
      // Send OTP Email
    //   const emailResponse = await sendOtpEmail(email, otp);
    // res.status(200).json({ message: "OTP sent successfully", emailResponse });
    res.status(200).json({ message: "OTP sent successfully", otp }); // For testing purposes, return OTP in response
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

const UpdateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { state, city, locality } = req.body;
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { state, city, locality },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" }); // User not found
    }

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

const GetAllUsers = async (req, res) => {
  try {
    // const users = await User.find({}, { password: 0 }); // Exclude password field
    const users = await User.find().select("-password"); // Exclude password field
    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

const SignOutUser = async (req, res) => {
  try {
    // set user token to null in the database from user model
    const { userId } = req.params; // Assuming you send userId in the request body

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    user.token = null; // Set the token to null or remove it from the database
    await user.save();
    res.status(200).json({ message: "User signed out successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

const deleteAccount = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    const vendor = await Vendor.findById(id);
    if (!user && !vendor) {
      return res.status(404).json({ message: "Account not found" });
    }
    if (user) {
      await User.findByIdAndDelete(id);
    }
    if (vendor) {
      await Vendor.findByIdAndDelete(id);
    }
    res.status(200).json({ message: "Account deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  SignUp,
  verifyOtp,
  resendOtp,
  SignIn,
  authenticateUser,
  UpdateUser,
  GetAllUsers,
  SignOutUser,
  deleteAccount,
  tokenValidaty,
};
