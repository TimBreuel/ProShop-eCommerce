import express from "express";
import { authUser, getUserProfile } from "../controllers/userController.js";
import asyncHandler from "express-async-handler";
import { protect } from "../middleware/authMiddleware.js";

const userRouter = express.Router();

// @desc    Auth user & get token
// @route   Post /api/users/login
// @access  Public
userRouter.post(
  "/login",
  asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const user = await authUser(email, password);
    if (user && user !== "Invalid Email or Password") {
      res.json(user);
    } else {
      res.status(401);
      throw new Error('"Invalid Email or Password"');
    }
  })
);

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
userRouter.get(
  "/profile",
  protect,
  asyncHandler(async (req, res) => {
    const user = await getUserProfile(req.user._id);
    if (user) {
      res.json(user);
    } else {
      res.status(404);
      throw new Error("User not found");
    }
  })
);

// userRouter.post(async (req, res) => {
//   console.log(req.body);

//   const user = await User.findOne({ email });
//   if (user && (await user.matchPassword(password))) {
//     res.send({
//       _id: user._id,
//       name: user.name,
//       email: user.email,
//       isAdmin: user.isAdmin,
//       token: null,
//     });
//   } else {
//     res.status(401);
//     throw new Error("invalid Emal or Password");
//   }
// });

export default userRouter;