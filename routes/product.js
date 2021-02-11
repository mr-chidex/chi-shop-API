import express from "express";
import { getProduct, getProducts, addProduct } from "../controllers/product.js";
import { protect } from "../middleware/authMiddlesware.js";
const router = express.Router();

router.route("/").get(getProducts).post(protect, addProduct);
router.get("/:id", getProduct);

export default router;
