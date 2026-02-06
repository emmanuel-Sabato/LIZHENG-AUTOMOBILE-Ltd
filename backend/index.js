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
app.use(cors());
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
            const token = jwt.sign(user, process.env.JWT_SECRET, { expiresIn: '24h' });

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

const settingRoutes = require('./routes/settingRoutes');
const carRoutes = require('./routes/carRoutes');
const orderRoutes = require('./routes/orderRoutes');

app.use('/api/settings', settingRoutes);
app.use('/api/cars', carRoutes);
app.use('/api/orders', orderRoutes);

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

