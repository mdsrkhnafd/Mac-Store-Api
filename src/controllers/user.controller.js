const User = require("../models/user.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const SignUp = async (req, res) => {
  try {
    const { fullName, email, password } = req.body;

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
      let user = new User({ fullName, email, password: hashedPassword });
      user = await user.save();
      res.status(201).json({ message: "User created successfully", user });
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

    // Compare the password with the hashed password
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

module.exports = {
  SignUp,
  SignIn,
  UpdateUser,
  GetAllUsers,
  SignOutUser,
};
