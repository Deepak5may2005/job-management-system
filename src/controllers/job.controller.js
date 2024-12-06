import HandleError from "../utils/HandleError.js";
import HandleResponse from "../utils/HandleResponse.js";
import Job from "../models/jobs.model.js";


const createJob = async (req, res) => {
    try {
        /*
        1. Take all required fields from the request body
        2. Sanitize them properly
        3. Create a job post by creating a new document for that job
        4. Return response along with the created job post
        */
        const { title, experience, salary, skills, job_location, description, vacancy, company_details } = req.body;

        if (!title || !experience || !salary || !description || !vacancy) {
            return res
            .status(400)
            .json(
                new HandleError(400, "All required fields are required")
            );
        }

        const newJob = new Job({
            title,
            experience,
            salary,
            skills,
            job_location,
            description,
            vacancy,
            company_details,
            date_of_post: new Date()
        });

        await newJob.save();

        return res
        .status(201)
        .json(
            new HandleResponse(201, newJob, "Job post created successfully")
        );

    } catch (error) {
        return res
        .status(500)
        .json(
            new HandleError(500, error.message)
        );
    }
};

const listAllJobs = async (req, res) => {
    try {
        /*
        1. List all jobs from the database
        2. Return response along with the list of all jobs
        */
        const jobs = await Job.find();
        
        if (jobs.length === 0) {
            return res
            .status(400)
            .json(
                new HandleError(400, "No jobs found!")
            );
        }

        return res
        .status(200)
        .json(
            new HandleResponse(200, jobs, "Jobs fetched successfully!")
        );
    } catch (error) {
        return res
        .status(500)
        .json(
            new HandleError(500, "Internal Server Error!")
        );
    }
};

const getJobById = async (req, res) => {
    try {
        /*
        1. Get job by ID from the request parameters
        2. Return response along with the job data
        */
        const job = await Job.findById(req.params.id);

        if (!job) {
            return res
            .status(400)
            .json(
                new HandleError(400, "Job not found!")
            );
        }

        return res
        .status(200)
        .json(
            new HandleResponse(200, job, "Job fetched successfully!")
        );
    } catch (error) {
        return res
        .status(500)
        .json(
            new HandleError(500, "Internal Server Error!")
        );
    }
};

const updateJobById = async (req, res) => {
    try {
        /*
        1. Take all necessary parameters from the request body
        2. Sanitize them properly
        3. Fetch job document by its _id
        4. Make changes in the job details
        5. Save the changes
        6. Return response along with the updated job
        */
        const { title, experience, salary, skills, job_location, description, vacancy, company_details } = req.body;

        const job = await Job.findById(req.params.id);

        if (!job) {
            return res
            .status(400)
            .json(
                new HandleError(400, "Job not found")
            );
        }

        job.title = title || job.title;
        job.experience = experience || job.experience;
        job.salary = salary || job.salary;
        job.skills = skills || job.skills;
        job.job_location = job_location || job.job_location;
        job.description = description || job.description;
        job.vacancy = vacancy || job.vacancy;
        job.company_details = company_details || job.company_details;

        await job.save();

        return res
        .status(200)
        .json(
            new HandleResponse(200, job, "Job updated successfully!")
        );
    } catch (error) {
        return res
        .status(500)
        .json(
            new HandleError(500, "Internal Server Error!")
        );
    }
};

const deleteJobById = async (req, res) => {
    try {
        /*
        1. Take job ID from request parameters
        2. Delete the job by its ID
        3. Return response with a success message
        */
        const job = await Job.findByIdAndDelete(req.params.id);

        if (!job) {
            return res
            .status(400)
            .json(
                new HandleError(400, "Job not found!")
            );
        }

        return res
        .status(200)
        .json(
            new HandleResponse(200, null, "Job deleted successfully!")
        );
    } catch (error) {
        return res
        .status(500)
        .json(
            new HandleError(500, "Internal Server Error!")
        );
    }
};

export {
    createJob,
    listAllJobs,
    getJobById,
    updateJobById,
    deleteJobById
};
