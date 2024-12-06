import HandleError from "../utils/HandleError.js"
import HandleResponse from "../utils/HandleResponse.js"
import JobSeeker from "../models/jobSeeker.model.js"
import uploadOnCloudinary from "../utils/cloudinary.js"
import bcrypt from "bcrypt";
import dotenv from "dotenv";

dotenv.config();

const signup = async (req, res) => {
    const {name, email, phone_no, gender, education, experience, location, skills, password } = req.body

    if (!name || !email || !phone_no || !gender || !education || !experience || !location || !skills || !password) {
        return res
        .status(400)
        .json(
            new HandleError(400, "All fields are required!")
        )
    }

    const resume = req.file
    console.log(resume)
    if (!resume) {
        return res
        .status(400)
        .json(
            new HandleError(400, "Resume is required!!")
        )
    }

    const response = await uploadOnCloudinary(resume.path)
    console.log(response)

    if (!response) {
        return res
        .status(500)
        .json(
            new HandleError(500, "Something went wrong while uploading resume!")
        )
    }

    const isExistedJobSeeker = await JobSeeker.findOne({ $or: [ { email }, { phone_no } ] })

    if (isExistedJobSeeker) {
        return res
        .status(400)
        .json(
            new HandleError(400, "Jobseeker is already existed!")
        )
    }

    const jobseeker = await JobSeeker.create({
        name: name,
        email: email,
        phone_no: Number(phone_no),
        gender: gender,
        education: education,
        experience: experience,
        location: location,
        skills : skills,
        password: password,
        resume: response.secure_url
    })

    const isCreated = await JobSeeker.findById(jobseeker?._id).select("-password")

    if (!isCreated) {
        return res
        .status(500)
        .json(
            new HandleError(500, "Something went wrong while creating account!")
        )
    }

    return res
    .status(201)
    .json(
        new HandleResponse(200, isCreated, "Profile created successfully!")
    )
}

const login = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res
        .status(400)
        .json(
            new HandleError(400, "Email and password are required!")
        );
    }

    const jobSeeker = await JobSeeker.findOne({ email });
    if (!jobSeeker) {
        return res
        .status(400)
        .json(
            new HandleError(400, "Jobseeker not found!")
        );
    }

    const isValidPassword = await jobSeeker.comparePassword(password)
    if (!isValidPassword) {
        return res
        .status(400)
        .json(
            new HandleError(400, "Invalid Password!")
        );
    }

    const Token = jobSeeker.generateAccessToken()
    const options = {httpOnly: true, secure: true}

    return res
    .status(200)
    .cookie("accessToken", Token, options)
    .json(
        new HandleResponse(200, { }, "Login successful!")
    );
};

const logout = async (req, res) => {
    res.clearCookie("accessToken");
    return res
    .status(200)
    .json(
        new HandleResponse(200, null, "Logout successful!")
    );
};

const updateName = async (req, res) => {
    const { name } = req.body;
    if (!name) {
        return res
        .status(400)
        .json(
            new HandleError(400, "Name is required!")
        );
    }

    const updatedJobSeeker = await JobSeeker.findByIdAndUpdate(
        req.jobSeeker._id,
        { name },
        { new: true }
    ).select("-password");

    return res
    .status(200)
    .json(
        new HandleResponse(200, updatedJobSeeker, "Name updated successfully!")
    );
};

const updateEmail = async (req, res) => {
    const { email } = req.body;
    if (!email) {
        return res
        .status(400)
        .json(
            new HandleError(400, "Email is required!")
        );
    }

    const updatedJobSeeker = await JobSeeker.findByIdAndUpdate(
        req.jobSeeker._id,
        { email },
        { new: true }
    ).select("-password");

    return res
    .status(200)
    .json(
        new HandleResponse(200, updatedJobSeeker, "Email updated successfully!")
    );
};

const updatePhoneNo = async (req, res) => {
    const { phone_no } = req.body;
    if (!phone_no) {
        return res
        .status(400)
        .json(
            new HandleError(400, "Phone number is required!")
        );
    }

    const updatedJobSeeker = await JobSeeker.findByIdAndUpdate(
        req.jobSeeker._id,
        { phone_no },
        { new: true }
    ).select("-password");

    return res
    .status(200)
    .json(
        new HandleResponse(200, updatedJobSeeker, "Phone number updated successfully!")
    );
};

const updateResume = async (req, res) => {
    const resume = req.file;
    if (!resume) {
        return res
        .status(400)
        .json(
            new HandleError(400, "Resume is required!")
        );
    }

    const uploadResponse = await uploadOnCloudinary(resume.path);
    if (!uploadResponse) {
        return res
        .status(500)
        .json(
            new HandleError(500, "Something went wrong while uploading resume!")
        );
    }

    const updatedJobSeeker = await JobSeeker.findByIdAndUpdate(
        req.jobSeeker._id,
        { resume: uploadResponse.secure_url },
        { new: true }
    ).select("-password");

    if (!updatedJobSeeker) {
        return res
            .status(400)
            .json(new HandleError(400, "JobSeeker not found!"));
    }

    return res
    .status(200)
    .json(
        new HandleResponse(200, updatedJobSeeker, "Resume updated successfully!")
    );
};

const updateEducation = async (req, res) => {
    const { education } = req.body;
    if (!education) {
        return res
        .status(400)
        .json(
            new HandleError(400, "Education is required!")
        );
    }

    const updatedJobSeeker = await JobSeeker.findByIdAndUpdate(
        req.jobSeeker._id,
        { education },
        { new: true }
    ).select("-password");

    return res
    .status(200)
    .json(
        new HandleResponse(200, updatedJobSeeker, "Education updated successfully!")
    );
};

const updateExperience = async (req, res) => {
    const { experience } = req.body;
    if (!experience) {
        return res
        .status(400)
        .json(
            new HandleError(400, "Experience is required!")
        );
    }

    const updatedJobSeeker = await JobSeeker.findByIdAndUpdate(
        req.jobSeeker._id,
        { experience },
        { new: true }
    ).select("-password");

    return res
    .status(200)
    .json(
        new HandleResponse(200, updatedJobSeeker, "Experience updated successfully!")
    );
};

const updateLocation = async (req, res) => {
    const { location } = req.body;
    if (!location) {
        return res
        .status(400)
        .json(
            new HandleError(400, "Location is required!")
        );
    }

    const updatedJobSeeker = await JobSeeker.findByIdAndUpdate(
        req.jobSeeker._id,
        { location },
        { new: true }
    ).select("-password");

    return res
    .status(200)
    .json(
        new HandleResponse(200, updatedJobSeeker, "Location updated successfully!")
    );
};

const updateSkills = async (req, res) => {
    const { skills } = req.body;
    if (!skills || !Array.isArray(skills)) {
        return res
        .status(400)
        .json(
            new HandleError(400, "Skills are required!")
        );
    }

    const updatedJobSeeker = await JobSeeker.findByIdAndUpdate(
        req.jobSeeker._id,
        { skills },
        { new: true }
    ).select("-password");

    return res
    .status(200)
    .json(
        new HandleResponse(200, updatedJobSeeker, "Skills updated successfully!")
    );
};

const updatePassword = async (req, res) => {

    const { password } = req.body;
        if (!password) {
            return res
            .status(400)
            .json(
                new HandleError(400, "Password required!")
            );
        }

        if (password.trim() === "") {
            return res
            .status(400)
            .json(
                new HandleError(400, "Password should not be empty!")
            );
        }

        if (password.trim().length < 8 || password.trim().length > 16) {
            return res
            .status(400)
            .json(
                new HandleError(400, "Password should be 8 to 16 characters long!")
            );
        }

        const encryptedPassword = await bcrypt.hash(password.trim(), 10);
        const data = await JobSeeker.findByIdAndUpdate(
            req.jobSeeker._id,
            {
                $set: {
                    password: encryptedPassword,
                },
            },
            {
                new: true, 
            }
        );

        return res
        .status(200)
        .json(
            new HandleResponse(200, data, "Password updated successfully!")           
        );
};

const currentJobSeeker = async (req, res) => {
    const jobSeeker = await JobSeeker.findById(req.jobSeeker._id).select("-password");
    return res
    .status(200)
    .json(
        new HandleResponse(200, jobSeeker, "JobSeeker profile fetched successfully!")
    );
};

const deleteAccount = async (req, res) => {
    const jobSeeker = await JobSeeker.findByIdAndDelete(req.jobSeeker._id);
    return res
    .status(200)
    .json(
        new HandleResponse(200, null, "JobSeeker account deleted successfully!")
    );
};

export { signup, login, logout, updateName, updateEmail,updatePhoneNo, updateResume, updateEducation,
    updateExperience,updateLocation, updateSkills, updatePassword, currentJobSeeker, deleteAccount
};
