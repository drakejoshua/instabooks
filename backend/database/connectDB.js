import mongoose from 'mongoose';
import logger from '../utils/winston.js';

export async function connectDB() {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            serverSelectionTimeoutMS: 5000
        })

        logger.info({
            event: "db_connection_success",
            message: "Successfully connected to the database."
        })
    } catch( err ) {
        logger.error({
            event: "db_connection_error",
            message: err?.message,
            stack: err?.stack,
            code: err?.code
        })

        process.exit(1)
    }
}