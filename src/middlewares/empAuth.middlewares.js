import HandleError from "../utils/HandleError.js";
import jwt from "jsonwebtoken";
import Employer from "../models/employer.model.js";

const empAuth = async (req, res, next) => {
    try {
        const token = req.cookies?.accessToken;

        if (!token) {
            return res
            .status(400)
            .json(
                new HandleError(400, "Token expired!!")
            );
        }

        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

        const employerData = await Employer.findById(decodedToken._id).select("-password");
        if (!employerData) {
            return res
            .status(400)
            .json(
                new HandleError(400, "Invalid Token!")
            );
        }

        req.employer = employerData;
        next();
    } catch (error) {
        return res
        .status(400)
        .json(
            new HandleError(400, "Authentication failed!")
        );
    }
};

export default empAuth;