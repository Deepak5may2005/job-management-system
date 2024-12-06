import HandleError from "../utils/HandleError.js";
import Job from "../models/jobs.model.js";

const checkJobExistence = async (req, res, next) => {
    try {
        const job_Id = req.params.id;
        const job = await Job.findById(job_Id);

        if (!job) {
            return res
            .status(400)
            .json(
                new HandleError(400, "Job not found!")
            );
        }

        req.job = job;
        next();
    } catch (error) {
        return res
        .status(500)
        .json(
            new HandleError(500, "Internal Server Error")
        );
    }
};

export default checkJobExistence;