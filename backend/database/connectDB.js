// Config file for connecting to the MongoDB database using Mongoose. 
// It exports a function that establishes the connection and handles any
// errors that may occur during the connection process. The function uses 
// the MONGO_URI environment variable to connect to the database and logs 
// the connection status using a logger utility.
import mongoose from "mongoose";
import logger from "../domains/shared/utils/winston.js";

// connectDB()
// This function connects to the MongoDB database using Mongoose. It 
// attempts to establish a connection with a specified timeout and logs 
// the success or failure of the connection attempt. If the connection 
// fails, it logs the error details and exits the process.
export async function connectDB() {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            serverSelectionTimeoutMS: 5000,
        });

        // log a success message if the connection is established 
        // successfully
        logger.info({
            event: "db_connection_success",
            message: "Successfully connected to the database.",
        });
    } catch (err) {
        // log an error message if the connection fails and exit 
        // the process
        logger.error({
            event: "db_connection_error",
            message: err?.message,
            stack: err?.stack,
            code: err?.code,
        });

        process.exit(1);
    }
}
