import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import dotenv from "dotenv";

dotenv.config();

const app = express()

app.use(express.json({ extended: true }))
app.use(express.urlencoded())
app.use(express.static("public/temp"))
app.use(cors({ origin: process.env.CORS_ORIGIN })) 
app.use(cookieParser())


import employeerRouter from "./routes/employeer.router.js"
import jobSeekerRouter from "./routes/jobSeeker.routes.js"
import jobRouter from "./routes/job.router.js"
import applicantRouter from "./routes/applicants.router.js"

app.use("/api/v1/employer",employeerRouter)         //http://localhost:4000/api/v1/employer/login
app.use("/api/v1/jobSeeker",jobSeekerRouter)        //http://localhost:4000/api/v1/jobSeeker/login
app.use("/api/v1/jobs", jobRouter)                  //http://localhost:4000/api/v1/jobs/login
app.use("/api/v1/applicants", applicantRouter)      //http://localhost:4000/api/v1/applicants/login

export default app