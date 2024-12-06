import HandleError from "../utils/HandleError.js";
import HandleResponse from "../utils/HandleResponse.js";
import Applicant from "../models/application.model.js";
import Job from "../models/jobs.model.js";

const applyToJob = async (req, res) => {
    /*
    1. take all necessary parameters
    2. sanitize them properly
    3. check applicant_id is present or not in the database
    4. If present, just throw an error
    5. If not, create a new job application
    6. Save the application in the database
    7. Return a response with success message
    */

    const { job_id } = req.body;
    if (!job_id) {
        return res
        .status(400)
        .json(
            new HandleError(400, "Job ID is required!")
        );
    }

    if (!req.jobSeeker || !req.jobSeeker._id) {
        return res
        .status(400)
        .json(
            new HandleError(400, "Unauthorized!")
        );
    }


    try {
        const jobDoc = await Job.findById(job_id);
        if (!jobDoc) {
            return res
            .status(400)
            .json(
                new HandleError(400, "Job not found!")
            );
        }

        const existingApplication = await Applicant.findOne({
            applicant_id: req.jobSeeker._id,
            job_id,
        });

        if (existingApplication) {
            return res
            .status(409)
            .json(
                new HandleError(409, "You have already applied for this job!")
            );
        }

        const jobApplication = await Applicant.create({
            applicant_name: req.jobSeeker?.name,
            applicant_id: req.jobSeeker._id,
            phone_no: req.jobSeeker.phone_no,
            email: req.jobSeeker.email,
            resume: req.jobSeeker.resume,
            job_id,
        });

        return res
        .status(201)
        .json(
            new HandleResponse(201, jobApplication, "Application submitted successfully!")
        );
    } catch (error) {
        console.error("Error in applyToJob:", error.message);
        return res
        .status(500)
        .json(
            new HandleError(500, "Internal Server Error!")
        );
    }
};


const getAllApplicationsByApplicantId = async (req, res) => {
    
    /*
    1. take applicant_id from the request parameters
    2. find all applications for this applicant in the database
    3. Return a response with the list of applications
    */
    try {
        const applications = await Applicant.find();

        if (!applications.length === 0) {
            return res
            .status(400)
            .json(
                new HandleError(400, "No applications found!")
            );
        }

        return res
            .status(200)
            .json(
                new HandleResponse(200, applications, "Applications fetched successfully!")
            );
    } catch (error) {
        return res
            .status(500)
            .json(
                new HandleError(500, error.message)
            );
    }
};

const getApplicationById = async (req, res) => {
    
    /*
    1. take application_id from the request parameters
    2. find the application in the database by id
    3. Return a response with the application details
    */
    try {
        const { id } = req.params;
        const application = await Applicant.findById(id);

        if (!application) {
            return res
                .status(400)
                .json(
                    new HandleError(400, "Application not found!")
                );
        }

        return res
            .status(200)
            .json(
                new HandleResponse(200, application, "Application fetched successfully!")
            );
    } catch (error) {
        return res
            .status(500)
            .json(
                new HandleError(500, error.message)
            );
    }
};

const deleteJobApplication = async (req, res) => {
    
    /*
    1. take application_id from the request parameters
    2. check if the application exists in the database
    3. If not, throw an error
    4. Delete the application from the database
    5. Return a response with success message
    */
    try {
        const { id } = req.params;

        const application = await Applicant.findById(id);

        if (!application) {
            return res
                .status(400)
                .json(
                    new HandleError(400, "Application not found!")
                );
        }

        await application.deleteOne();

        return res
            .status(200)
            .json(
                new HandleResponse(200, null, "Application deleted successfully!")
            );
    } catch (error) {
        return res
            .status(500)
            .json(
                new HandleError(500, error.message)
            );
    }
};

export {
    applyToJob,
    getAllApplicationsByApplicantId,
    getApplicationById,
    deleteJobApplication
};