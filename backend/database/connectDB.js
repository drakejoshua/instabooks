import mongoose from 'mongoose';

export async function connectDB() {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            serverSelectionTimeoutMS: 5000
        })

        console.log("DB connected successfully")
    } catch( err ) {
        console.log("DB connection error: ", err )

        process.exit(1)
    }
}