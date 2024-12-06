import mongoose, {Schema} from "mongoose"

const applicantSchema = new Schema({
    applicant_name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phone_no: {
        type: Number,
        maxLength: 10,
        minLength: 10,
        required: true
    },
    resume: {
        type: String,  // Cloudinary_URL
        required: true
    },
    job_id:{
        type: Schema.Types.ObjectId,
        ref: "Job",
        required: true
    }
})

applicantSchema.pre("save", function (next) {
    if (!this.email || !this.phone_no) {
        return next(new Error("Email and phone number are mandatory!"));
    }
    next();
});

applicantSchema.statics.isDuplicateApplication = async function (email, job_id) {
    const existingApplicant = await this.findOne({ email, job_id });
    return !!existingApplicant;
};

const Applicant = mongoose.model("Applicant",applicantSchema)
export default Applicant