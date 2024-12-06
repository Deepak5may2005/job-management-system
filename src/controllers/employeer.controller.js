import Employer from "../models/employer.model.js";
import HandleError from "../utils/HandleError.js";
import HandleResponse from "../utils/HandleResponse.js";
import bcrypt from "bcrypt"

const signup = async (req, res) => {
    const { name, email, phone_no, address, status, password } = req.body;

    if (!name || !email || !phone_no || !address || !status || !password) {
        return res
        .status(400)
        .json(
            new HandleError(400, "All fields are required!!")
        );
    }

    if (name.trim() === "") {
        return res
        .status(400)
        .json(
            new HandleError(400, "Name should not be empty!!")
        );
    }

    if (!/\b[\w\.-]+@[\w\.-]+\.\w{2,4}\b/.test(email.trim())) {
        return res
        .status(400)
        .json(
            new HandleError(400, "E-Mail should not be empty!!")
        );
    }

    if (String(phone_no).length !== 10) {
        return res
        .status(400)
        .json(
            new HandleError(400, "Phone no must be 10 digits long!!")
        );
    }

    if (address.trim() === "") {
        return res
        .status(400)
        .json(
            new HandleError(400, "Address should not be empty!")
        );
    }

    if (status.trim() === "" || (status !== "company" && status !== "individual")) {
        return res
        .status(400)
        .json(
            new HandleError(400, "Status should be either company or individual")
        );
    }

    if (password.trim().length < 8 || password.trim().length > 16) {
        return res
        .status(400)
        .json(
            new HandleError(400, "Password should be 8 to 16 digits long!")
        );
    }

    const isExistedEmployer = await Employer.findOne({ $or: [{ email }, { phone_no }] });
    if (isExistedEmployer) {
        return res
        .status(400)
        .json(
            new HandleError(400, "Already have an account! Please go for signin!!")
        );
    }

    const employer = await Employer.create({ name, email, phone_no, address, status, password });
    const createdEmployer = await Employer.findById(employer._id).select("-password");
    if (!createdEmployer) {
        return res
        .status(400)
        .json(
            new HandleError(400, "Something went wrong while creating employer's account!")
        );
    }

    return res
    .status(201)
    .json(
        new HandleResponse(200, createdEmployer, "Account created successfully!")
    );
};

const login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res
        .status(400)
        .json(
            new HandleError(400, "All fields are required!!")
        );
    }

    if (email.trim() === "") {
        return res
        .status(400)
        .json(
            new HandleError(400, "Email is required!!")
        );
    }

    if (password.trim().length < 8 || password.trim().length > 16) {
        return res
        .status(400)
        .json(
            new HandleError(400, "Password must be 8 to 16 digits long!")
        );
    }

    const employerData = await Employer.findOne({ email: email.trim() });
    if (!employerData) {
        return res
        .status(400)
        .json(
            new HandleError(400, "Account not exists! Please create an account!")
        );
    }

    const isCorrectPassword = await employerData.comparePassword(password);
    if (!isCorrectPassword) {
        return res
        .status(400)
        .json(
            new HandleError(400, "Invalid password!")
        );
    }

    const accessToken = employerData.generateAccessToken();
    const options = {
        httpOnly: true,
        secure: true,
    };

    return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .json(
        new HandleResponse(200, {}, "Login Successfully!")
    );
};

const logout = async (req, res) => {
    if (!req?.employer) {
        return res
        .status(400)
        .json(
            new HandleError(400, "You haven't logged in yet!")
        );
    }

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
    .status(200)
    .clearCookie("accessToken")
    .json(
        new HandleResponse(200, {}, "Logged Out successfully")
    )

}

const currentEmployee = async (req, res) => {
    return res
        .status(200)
        .json(
            new HandleResponse(200, req?.employeer, "Current employeer fetched successfully!")
        );
}

const updateDetails = async (req, res) => {
    const {name, email,phone_no,website, password} = req.body

    if (!name && !email && !phone_no && !website && !password) {
        return res
        .status(400)
        .json(
            new HandleError(400, "You have to provide at least 1 field!")
        )
    }

    if (name && name?.trim() === "") {
        return res
        .status(400)
        .json(
            new HandleError(400, "Name should not be empty!!")
        );
    }

    if (email && !/\b[\w\.-]+@[\w\.-]+\.\w{2,4}\b/.test(email.trim())) {
        return res
        .status(400)
        .json(
            new HandleError(400, "Invalid E-Mail!")
        );
    }

    if (phone_no && (phone_no?.trim()?.length !== 10)) {
        return res
        .status(400)
        .json(
            new HandleError(400, "Invalid Phone Number!")
        );
    }

    if (website && test(website ?. trim())) {
        return res
        .status(400)
        . json(
                new HandleError(400, "Invalid Website URL")
            );
    }
    

    if (password && (password?.trim()?.length <8 || password?.trim()?.length > 16)) {
        return res
        .status(400)
        .json(
            new HandleError(400, "Invalid password length!")
        );
    }

    const employerData = await Employer.findById(req.employer._id)

    if (!employerData) {
        return res
            .status(404)
            .json(new HandleError(404, "Employer not found!"));
    }

    employerData.name = name?.trim() || employerData.name;
    employerData.email = email?.trim() || employerData.email;
    employerData.phone_no = phone_no?.trim() || employerData.phone_no;
    employerData.website = website?.trim() || employerData.website;

    await employerData.save({ validateBeforeSave: false })

    const updateData = await Employer.findById(req.employer._id).select("-password")

    return res
    .status(200)
    .json(
        new HandleResponse(
            200, updateData, "Details updated successfully!"
        )
    )

}

const updatePassword = async (req, res) => {
    const {password} = req.body

    if (!password) {
        return res
        .status(400)
        .json(
            new HandleError(400, "Password required!")
        )
    }

    if (password?.trim() === "") {
        return res
        .status(400)
        .json(
            new HandleError(400, "Password should not be empty!")
        )
    }
    if (password?.trim().length < 8 || password?.trim().length > 16) {
        return res
        .status(400)
        .json(
            new HandleError(400, "Password should be 8 to 16 digits long!")
        )
    }

    try {
        const encryptedPassword = await bcrypt.hash(password.trim(), 10);

        const updatedData = await Employer.findByIdAndUpdate(
            req.employer._id,
            { $set: { password: encryptedPassword } },
            { new: true }
        );

        if (!updatedData) {
            return res
                .status(404)
                .json(new HandleError(404, "Employer not found!"));
        }

        return res
            .status(200)
            .json(new HandleResponse(200, {}, "Password updated successfully!"));
    } catch (error) {
        console.error("Error updating password:", error.message);
        return res
            .status(500)
            .json(new HandleError(500, "Internal Server Error!"));
    }
};

const deleteAccount = async (req, res) => {
    if (!req?.employer) {
        return res
            .status(400)
            .json(
                new HandleError(400, "You have not logged in!!")
            )
    }

    const employerData = await Employer.findByIdAndDelete(req.employer._id)

    if (!employerData) {
        return res
            .status(400)
            .json(
                new HandleError(400, "Account not found or already deleted!!")
            )
    }

    return res
        .status(200)
        .json(
            new HandleResponse(200, "Account deleted successfully!!")
        )
}

export { signup, login, logout, currentEmployee, updateDetails, updatePassword, deleteAccount };