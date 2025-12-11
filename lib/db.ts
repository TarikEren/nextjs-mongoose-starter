import mongoose from "mongoose"

export async function connectDB() {
    /* Connects to MongoDB using connection pooling */
    const DB_URL = process.env.DB_URL;
    if (!DB_URL) {
        console.error("No DB_URL specified in .env");
        throw new DatabaseError();
    }
    const options = {
        maxPoolSize: 10,
        minPoolSize: 2,
        maxIdleTimeMS: 30000,
        waitQueueTimeoutMS: 5000
    }
    mongoose.connect(DB_URL, options)
        .then(() => console.log("Connected to MongoDB"))
        .catch((error) => {
            console.error(`Failed connecting to MongoDB: ${error}`)
            throw new DatabaseError();
        });
}
