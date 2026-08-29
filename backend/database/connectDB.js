// Config file for connecting to the MongoDB database using Mongoose. 
// It exports a function that establishes the connection and handles any
// errors that may occur during the connection process. The function uses 
// the MONGO_URI environment variable to connect to the database and logs 
// the connection status using a logger utility.
import mongoose from "mongoose";
import { logDBConnectionError, logDBConnectionSuccess } from "../infra/utils/logging/logFunctions.js";

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
        logDBConnectionSuccess();
    } catch (err) {
        // log an error message if the connection fails and exit 
        // the process
        logDBConnectionError(err);

        process.exit(1);
    }
}
