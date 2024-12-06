import { Router } from "express";
import { signup, login, logout, updateName, updateEmail, updatePhoneNo, updateResume, updateEducation, 
    updateExperience, updateLocation, updateSkills, updatePassword,currentJobSeeker,deleteAccount
} from "../controllers/jobSeeker.controller.js";
import upload from "../middlewares/multer.middlewares.js";
import jobSeekerAuth from "../middlewares/jobSeekerAuth.middleware.js"

const router = Router();

router.route("/signup").post(upload.single("resume"), signup);
router.route("/login").post(login);
router.route("/logout").get(jobSeekerAuth, logout);
router.route("/update-name").patch(jobSeekerAuth, updateName);
router.route("/update-email").patch(jobSeekerAuth, updateEmail);
router.route("/update-phone").patch(jobSeekerAuth, updatePhoneNo);
router.route("/update-resume").patch(jobSeekerAuth, upload.single("resume"), updateResume);
router.route("/update-education").patch(jobSeekerAuth, updateEducation);
router.route("/update-experience").patch(jobSeekerAuth, updateExperience);
router.route("/update-location").patch(jobSeekerAuth, updateLocation);
router.route("/update-skills").patch(jobSeekerAuth, updateSkills);
router.route("/update-password").patch(jobSeekerAuth, updatePassword);
router.route("/current-job-seeker").get(jobSeekerAuth, currentJobSeeker);
router.route("/delete-account").delete(jobSeekerAuth, deleteAccount);

export default router;