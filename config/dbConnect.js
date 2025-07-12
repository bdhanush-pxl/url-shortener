import mongoose from 'mongoose';
import { config } from 'dotenv';

// Load environment variables
config();

const connectDB = async () => {
    try {
        if (!process.env.MONGODB_URI) {
            throw new Error('MONGODB_URI is not defined in environment variables');
        }
        
        const conn = await mongoose.connect(process.env.MONGODB_URI);
        
        console.log(`MongoDB Connected: ${conn.connection.host}`);
        return conn;
    } catch (error) {
        console.error('MongoDB connection error:', error.message);
        // Don't exit the process in development to allow for auto-restart
        if (process.env.NODE_ENV === 'production') {
            process.exit(1);
        }
        throw error;
    }
};

export { connectDB };