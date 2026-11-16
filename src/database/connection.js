import mongoose from "mongoose";
import configService from '../config/config.service.js'

export const dpconnect = async () => {
    try {
        await mongoose.connect(configService.dbUri, {
            family: 4,
            serverSelectionTimeoutMS: 10000,
            connectTimeoutMS: 10000,
        });
        await mongoose.syncIndexes();

        console.log("MongoDB connected successfully");
    } catch (error) {
        console.error("MongoDB connection error:", error);
        process.exit(1);
    }
}
