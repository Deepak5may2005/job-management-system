import mongoose from "mongoose";
import DBName from "../constant.js"

const connectDB = async () => {
    try{
        const connectionValue = await mongoose.connect(`${process.env.MONGODB_URL}/${DBName}`)
        console.log(`DB Connected Successfully :: ${connectionValue.connection.host}`)
    } catch (error) {
        console.error(`database.connect.js :: connectDB :: ERROR :: ${error?.message}`)
    }
}

export default connectDB