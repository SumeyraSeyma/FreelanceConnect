import { Router } from "express";
import { getMessages, sendMessage } from "../controller/messageController.js";
import { protectRoute } from "../middleware/authMiddleware.js";

const router = Router();

router.get("/:id", protectRoute, getMessages);

router.post("/send/:id", protectRoute, sendMessage);

export default router;