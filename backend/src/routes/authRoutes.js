import { Router } from "express";
import {
  signup,
  login,
  logout,
  updateProfile,
  getProfile,
  checkAuth,
} from "../controller/authController.js";
import { protectRoute } from "../middleware/authMiddleware.js";

const router = Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);

router.get("/profile", getProfile);
router.post("update-profile", protectRoute, updateProfile);

router.get("/check", protectRoute, checkAuth);

export default router;
