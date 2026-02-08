const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const jwt = require('jsonwebtoken');
const connectDB = require('./config/db');
const Admin = require('./models/Admin');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5001;

// Connect Database
connectDB();

// Middleware
const allowedOrigins = [
    'http://localhost:3000',
    'http://192.168.1.132:3000', // Local network access
    'https://lizheng-automobile-ltd.vercel.app', // Placeholder for frontend
    /\.vercel\.app$/ // Allow any vercel preview deployment
];

app.use(cors({
    origin: function (origin, callback) {
        // allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) !== -1 || allowedOrigins.some(regex => regex instanceof RegExp && regex.test(origin))) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true
}));
app.use(bodyParser.json());
app.use(morgan('dev'));

// Basic Route
app.get('/', (req, res) => {
    res.json({ message: 'Welcome to LIZHENG AUTOMOBILE API' });
});

// Admin Login Endpoint
app.post('/api/admin/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const admin = await Admin.findOne({ email });

        if (admin && (await admin.matchPassword(password))) {
            const user = {
                id: admin._id,
                name: admin.name,
                email: admin.email,
                role: admin.role
            };

            // Generate real JWT token
            const secret = process.env.JWT_SECRET;
            if (!secret) {
                console.error("CRITICAL ERROR: JWT_SECRET is not defined in environment variables");
                return res.status(500).json({
                    success: false,
                    message: "Server configuration error. Please contact administrator."
                });
            }

            const token = jwt.sign(user, secret, { expiresIn: '24h' });

            return res.json({
                success: true,
                message: 'Login successful',
                user,
                token
            });
        } else {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials. Please check your email and password.'
            });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// Seed Initial Admin (Run once or through tool)
app.post('/api/admin/seed', async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const adminExists = await Admin.findOne({ email });
        if (adminExists) {
            return res.status(400).json({ message: 'Admin already exists' });
        }

        const admin = await Admin.create({
            name,
            email,
            password
        });

        res.status(201).json({
            success: true,
            message: 'Admin account created successfully',
            admin: {
                id: admin._id,
                name: admin.name,
                email: admin.email
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Change Admin Password
app.put('/api/admin/password', async (req, res) => {
    // Basic protection (can be refactored to use middleware later)
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Not authorized' });
    }

    try {
        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const { currentPassword, newPassword } = req.body;

        const admin = await Admin.findById(decoded.id);
        if (!admin) {
            return res.status(404).json({ message: 'Admin not found' });
        }

        const isMatch = await admin.matchPassword(currentPassword);
        if (!isMatch) {
            return res.status(400).json({ message: 'Incorrect current password' });
        }

        admin.password = newPassword; // Middleware will hash it
        await admin.save();

        res.json({ success: true, message: 'Password updated successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

const settingRoutes = require('./routes/settingRoutes');
const carRoutes = require('./routes/carRoutes');
const orderRoutes = require('./routes/orderRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');
const messageRoutes = require('./routes/messageRoutes');

app.use('/api/settings', settingRoutes);
app.use('/api/cars', carRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/messages', messageRoutes);

// Error Handling Middleware
app.use((err, req, res, next) => {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode);
    res.json({
        message: err.message,
        stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

