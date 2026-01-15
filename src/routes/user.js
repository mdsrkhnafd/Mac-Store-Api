const express = require("express");
const {
  SignUp,
  SignIn,
  UpdateUser,
  GetAllUsers,
  SignOutUser,
} = require("../controllers/user.controller.js");

const userRouter = express.Router();

// TODO: User Signup api
userRouter.post("/api/signup", SignUp);

// TODO: User Signin api

userRouter.post("/api/signin", SignIn);

// put route Api for updating user's state, city, locality
userRouter.put("/api/users/:id", UpdateUser);

// Fetch all users(excluding password)
userRouter.get("/api/users", GetAllUsers);

// TODO: User Signout api

userRouter.post("/api/signout/:userId", SignOutUser);

module.exports = userRouter;
