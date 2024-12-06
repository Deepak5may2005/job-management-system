import mongoose, { Schema} from "mongoose"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

const jobSeekerSchema = new Schema({
    name: {
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
    gender: {
        type: String,
        enum: ["male","female","others"],
        required: true
    },
    resume: {
        type: String,  // Cloudinary_URL
        required: true
    },
    education:{
        type: String,
        required: true
    },
    experience: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    password: {
        type: String,
        minLength: 8,
        maxLength: 16,
        required: true
    },
    skills:[
        {
        type: String,
        required: true
    }
    ]
})

jobSeekerSchema.pre("save",async function(next) {
    if (this.isModified("password")) {
        this.password = await bcrypt.hash(this.password, 10)
    } else{
        next()
    }
})

jobSeekerSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password)
}

jobSeekerSchema.methods.generateAccessToken = function() {
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            phone_no: this.phone_no 
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}

const JobSeeker = mongoose.model("JobSeeker",jobSeekerSchema)
export default JobSeeker