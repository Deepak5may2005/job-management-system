import { Router } from "express";
import {createJob, listAllJobs, getJobById,updateJobById, 
    deleteJobById } from "../controllers/job.controller.js";
import checkJobExistence from "../middlewares/Job.middleware.js";

const router = Router();

router.route("/create").post(createJob);
router.route("/list").get(listAllJobs);
router.route("/:id").get(checkJobExistence, getJobById)   // check job existence before fetching job
router.route("/:id").patch(checkJobExistence, updateJobById)  //check job existence before updating job
router.route("/:id").delete(checkJobExistence, deleteJobById);  //check job existence before deleting job

export default router;