import { Router } from "express";
import { createJob, deleteJob, getUserJobs, updateJob, getAllJobs, applyJob, getJobWithApplicants } from "../controller/jobController.js";
import { protectRoute } from "../middleware/authMiddleware.js";

const router = Router();

router.get("/", getAllJobs);
router.get("/user", protectRoute, getUserJobs);
router.post("/", protectRoute, createJob);
router.delete("/:id",protectRoute, deleteJob);
router.put("/:id",protectRoute, updateJob);
router.get("/:id",protectRoute, getJobWithApplicants);
router.post("/:id/apply",protectRoute, applyJob);

export default router;

