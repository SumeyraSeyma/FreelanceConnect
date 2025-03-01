import { Router } from "express";
import { createJob, deleteJob, getJob, updateJob, getAllJobs } from "../controller/jobController.js";
import { protectRoute, checkEmployer } from "../middleware/authMiddleware.js";

const router = Router();

router.get("/", getAllJobs);
router.get("/:id", getJob);

router.post("/", protectRoute, checkEmployer,createJob);
router.delete("/:id",protectRoute, checkEmployer, deleteJob);
router.patch("/:id",protectRoute, checkEmployer, updateJob);

export default router;

