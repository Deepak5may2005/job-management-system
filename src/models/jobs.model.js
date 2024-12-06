import mongoose, {Schema} from "mongoose"

const jobSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    experience: {
        type: String,
        required: true
    },
    salary: {
        type: String,
        required: true
    },
    skills: {
        type: String,
    },
    job_location:{
        type: String,
        enum: ["remote","hybrid","onsite"],
    },
    description: {
        type: String,
        required: true
    },
    vacancy: {
        type: String,
        required: true
    },
    date_of_post: {
        type: Date,
        required: true
    },
    company_details: {
        type: String,
        required: true
    }
})
const Job = mongoose.model("Job",jobSchema)
export default Job