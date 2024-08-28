import express from "express";
import {
  createProductController,
  createProductReviewController,
  deleteProductController,
  deleteReviewController,
  getAllProductController,
  getAllReviewsController,
  productDetailController,
  updateProductController,
} from "../controllers/productController.js";
import { isAdmin, isAuthenticatedUser } from "../middleware/authMiddleware.js";

const router = express.Router();

// get all product
router.get("/products", getAllProductController);

// create product
router.post(
  "/products/new",
  isAuthenticatedUser,
  isAdmin("admin"),
  createProductController
);

// update product
router.put(
  "/products/:id",
  isAuthenticatedUser,
  isAdmin("admin"),
  updateProductController
);

// delete product
router.delete(
  "/products/:id",
  isAuthenticatedUser,
  isAdmin("admin"),
  deleteProductController
);

// get single product detail product
router.get("/product/:id", productDetailController);

// create product review
router.put("/review", isAuthenticatedUser, createProductReviewController);

// get all reviews
router.get("/reviews", getAllReviewsController);

// delete review
router.delete("/review", isAuthenticatedUser, deleteReviewController);




export default router;
