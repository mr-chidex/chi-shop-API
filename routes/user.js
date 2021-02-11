import express from "express";
import {
  authUser,
  getUserprofile,
  registerUser,
  updateProfile,
} from "../controllers/user.js";
import { protect } from "../middleware/authMiddlesware.js";

const router = express.Router();

router.route("/").post(registerUser);
router.route("/login").post(authUser);
router
  .route("/profile")
  .get(protect, getUserprofile)
  .put(protect, updateProfile);

export default router;
