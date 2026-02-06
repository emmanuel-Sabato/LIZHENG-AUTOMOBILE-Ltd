const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        // Log more details about the error if possible
        if (error.reason) console.error('Reason:', error.reason);
        process.exit(1);
    }
};

module.exports = connectDB;
