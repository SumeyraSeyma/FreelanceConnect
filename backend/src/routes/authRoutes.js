import { Router } from "express";
import {
  signup,
  login,
  logout,
  updateProfile,
  getProfile,
  checkAuth,
  getUserProfile,
} from "../controller/authController.js";
import { protectRoute } from "../middleware/authMiddleware.js";

const router = Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);

router.get("/profile", getProfile);
router.get("/profile/:id", getUserProfile);
router.put("/update-profile", protectRoute, updateProfile);

router.get("/check", protectRoute, checkAuth);

export default router;
