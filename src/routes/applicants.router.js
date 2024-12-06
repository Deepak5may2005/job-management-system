import { Router } from "express";
import { applyToJob, deleteJobApplication, getAllApplicationsByApplicantId, 
    getApplicationById } from "../controllers/applicants.controller.js";
import jobSeekerAuth from "../middlewares/jobSeekerAuth.middleware.js";

const router = Router();

router.route("/apply").post(jobSeekerAuth, applyToJob);
router.route("/list").get(jobSeekerAuth, getAllApplicationsByApplicantId);
router.route("/:id").get(jobSeekerAuth, getApplicationById);
router.route("/:id").delete(jobSeekerAuth, deleteJobApplication);

export default router;