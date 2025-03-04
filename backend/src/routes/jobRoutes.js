import { Router } from "express";
import { createJob, deleteJob, getUserJobs, updateJob, getAllJobs } from "../controller/jobController.js";
import { protectRoute, checkEmployer } from "../middleware/authMiddleware.js";

const router = Router();

router.get("/", getAllJobs);
router.get("/user", protectRoute, getUserJobs);
router.post("/", protectRoute, checkEmployer,createJob);
router.delete("/:id",protectRoute, checkEmployer, deleteJob);
router.put("/:id",protectRoute, checkEmployer, updateJob);

export default router;

