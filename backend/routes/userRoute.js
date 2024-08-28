import express from "express";
import {
  currentUserController,
  deleteUserController,
  forgotPasswordController,
  getAllUserController,
  getSingleUserController,
  resetPasswordController,
  updatePasswordController,
  updateUserController,
  updateUserRoleController,
  userLoginController,
  userLogOutController,
  userRegisterController,
} from "../controllers/authController.js";
import { isAdmin, isAuthenticatedUser } from "../middleware/authMiddleware.js";

const router = express.Router();

// register route
router.post("/register", userRegisterController);

// login route
router.post("/login", userLoginController);

// logout route
router.get("/logout", userLogOutController);

// forgot password route
router.post("/forgot-password", forgotPasswordController);

// reset password
router.put("/password-reset/:token", resetPasswordController);

// get single user
router.get("/me", isAuthenticatedUser, currentUserController);

// update password password
router.put("/update-password", isAuthenticatedUser, updatePasswordController);

// update user password
router.put("/me-update", isAuthenticatedUser, updateUserController);

// get all user
router.get(
  "/admin/users",
  isAuthenticatedUser,
  isAdmin("admin"),
  getAllUserController
);

// get Single user
router.get(
  "/admin/user/:id",
  isAuthenticatedUser,
  isAdmin("admin"),
  getSingleUserController
);

// update user role password
router.put(
  "/admin/user/:id",
  isAuthenticatedUser,
  isAdmin("admin"),
  updateUserRoleController
);

// delete user
router.delete(
  "/admin/user/:id",
  isAuthenticatedUser,
  isAdmin("admin"),
  deleteUserController
);

export default router;
