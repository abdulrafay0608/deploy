import express from "express";
import {
  deleteOrderController,
  getAllOrdersController,
  getSingleOrderController,
  myOrdersController,
  newOrderController,
  updateOrderStatusController,
} from "../controllers/orderController.js";
import { isAdmin, isAuthenticatedUser } from "../middleware/authMiddleware.js";

const router = express.Router();

// create order
router.post("/order/new", isAuthenticatedUser, newOrderController);

// get single order admin route
router.post(
  "/order/:id",
  isAuthenticatedUser,
  isAdmin("admin"),
  getSingleOrderController
);

// check own user
router.post("/orders/me", isAuthenticatedUser, myOrdersController);

// get all orders
router.get(
  "/admin/orders",
  isAuthenticatedUser,
  isAdmin("admin"),
  getAllOrdersController
);

// update Order Status
router.put(
  "/admin/order/:id",
  isAuthenticatedUser,
  isAdmin("admin"),
  updateOrderStatusController
);

// DELETE Order
router.delete(
  "/admin/order/:id",
  isAuthenticatedUser,
  isAdmin("admin"),
  deleteOrderController
);

export default router;
