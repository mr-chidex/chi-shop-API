import express from "express";
import {
  createOrder,
  getOrderById,
  updateOrderPayment,
} from "../controllers/order.js";
import { protect } from "../middleware/authMiddlesware.js";

const router = express.Router();

router.route("/").post(protect, createOrder);
router.route("/:orderId").get(protect, getOrderById);
router.route("/:orderId/pay").put(protect, updateOrderPayment);

export default router;
