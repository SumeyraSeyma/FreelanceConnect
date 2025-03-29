import { Router } from "express";
import { getMessages, sendMessage, getAllUsers, getChatUsers } from "../controller/messageController.js";
import { protectRoute } from "../middleware/authMiddleware.js";

const router = Router();

router.get("/", protectRoute, getAllUsers);

router.get("/:id", protectRoute, getMessages);

router.post("/send/:id", protectRoute, sendMessage);

router.get("/chat-users", protectRoute, getChatUsers);

export default router;