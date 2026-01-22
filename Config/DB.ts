import mongoose from "mongoose";

class Database {

    public async connectDB(): Promise<void> {
        const uri = process.env.MONGO_URI;
        if (!uri) {
            console.error("❌ MONGO_URI is not defined in environment variables!");
            return;
        }

        // Mask password for logging
        const maskedUri = uri.replace(/:([^@]+)@/, ":****@");
        console.log(`Attempting to connect to MongoDB: ${maskedUri}`);

        try {
            const conn = await mongoose.connect(uri, {
                serverSelectionTimeoutMS: 15000, // Timeout after 15s instead of 10s
                connectTimeoutMS: 15000,
            });
            console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
            console.log(`- Database Name: ${conn.connection.name}`);
        } catch (error) {
            console.error("❌ MONGODB CONNECTION ERROR ❌");
            if (error instanceof Error) {
                console.error(`- Error Name: ${error.name}`);
                console.error(`- Message: ${error.message}`);

                if (error.message.includes("ETIMEDOUT") || error.message.includes("querySrv ETIMEOUT")) {
                    console.error("💡 HINT: This is a network timeout. Check your internet or if your IP is whitelisted in MongoDB Atlas.");
                }
                if (error.message.includes("authentication failed")) {
                    console.error("💡 HINT: Check your database username and password.");
                }
            } else {
                console.error(`Unexpected error: ${error}`);
            }
        }
    }
}

export default new Database();
