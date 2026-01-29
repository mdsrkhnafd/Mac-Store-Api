const express = require("express");
const {auth} = require("../middleware/auth.js");
const {
  SignUp,
  verifyOtp,
  resendOtp,
  SignIn,
  UpdateUser,
  GetAllUsers,
  SignOutUser,
  deleteAccount,
  tokenValidaty,
  authenticateUser,
} = require("../controllers/user.controller.js");

const userRouter = express.Router();

// TODO: User Signup api
userRouter.post("/api/signup", SignUp);

// TODO: User verify otp api
userRouter.post("/api/verify-otp", verifyOtp);

// TODO: User Resend otp api
userRouter.post("/api/resend-otp", resendOtp);

// TODO: User Signin api
userRouter.post("/api/signin", SignIn);

// Authenticate user api
userRouter.get("/", auth, authenticateUser);

// put route Api for updating user's state, city, locality
userRouter.put("/api/users/:id", UpdateUser);

// Fetch all users(excluding password)
userRouter.get("/api/users", GetAllUsers);

// TODO: User Signout api
userRouter.post("/api/signout/:userId", SignOutUser);

// Delete user or vendor api
userRouter.delete("/api/users/delete-account /:id",auth,deleteAccount );

// Token validity check api
userRouter.post("/tokenIsValid", tokenValidaty);

module.exports = userRouter;
