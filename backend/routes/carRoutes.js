const express = require('express');
const router = express.Router();
const multer = require('multer');
const { storage } = require('../config/cloudinary');
const Car = require('../models/Car');
const { protect } = require('../middleware/authMiddleware');

const upload = multer({ storage });

// @desc    Get all cars
// @route   GET /api/cars
// @access  Public
router.get('/', async (req, res) => {
    try {
        const { featured, brand, category, status } = req.query;
        let query = {};

        if (featured) query.featured = featured === 'true';
        if (brand) query.brand = brand;
        if (category) query.category = category;
        if (status) query.status = status;

        const cars = await Car.find(query).sort({ createdAt: -1 });
        res.json(cars);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Get single car
// @route   GET /api/cars/:id
// @access  Public
router.get('/:id', async (req, res) => {
    try {
        const car = await Car.findById(req.params.id);
        if (car) {
            res.json(car);
        } else {
            res.status(404).json({ message: 'Car not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Add new car
// @route   POST /api/cars
// @access  Private/Admin
router.post('/', protect, upload.array('images', 10), async (req, res) => {
    try {
        const {
            name, brand, category, model, year, price,
            transmission, fuelType, mileage, description, featured, features
        } = req.body;

        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ message: 'Please upload at least one image' });
        }

        const imageUrls = req.files.map(file => file.path);

        const car = await Car.create({
            name,
            brand,
            category,
            model,
            year,
            price,
            transmission,
            fuelType,
            mileage,
            description,
            featured: featured === 'true' || featured === true,
            features: features ? (Array.isArray(features) ? features : JSON.parse(features)) : [],
            images: imageUrls
        });

        res.status(201).json(car);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Update car
// @route   PUT /api/cars/:id
// @access  Private/Admin
router.put('/:id', protect, upload.array('images', 10), async (req, res) => {
    try {
        const car = await Car.findById(req.params.id);

        if (car) {
            car.name = req.body.name || car.name;
            car.brand = req.body.brand || car.brand;
            car.category = req.body.category || car.category;
            car.model = req.body.model || car.model;
            car.year = req.body.year || car.year;
            car.price = req.body.price || car.price;
            car.transmission = req.body.transmission || car.transmission;
            car.fuelType = req.body.fuelType || car.fuelType;
            car.mileage = req.body.mileage || car.mileage;
            car.description = req.body.description || car.description;
            car.status = req.body.status || car.status;

            if (req.body.featured !== undefined) {
                car.featured = req.body.featured === 'true' || req.body.featured === true;
            }

            if (req.body.features !== undefined) {
                car.features = Array.isArray(req.body.features) ? req.body.features : JSON.parse(req.body.features);
            }

            if (req.files && req.files.length > 0) {
                car.images = req.files.map(file => file.path);
            }

            const updatedCar = await car.save();
            res.json(updatedCar);
        } else {
            res.status(404).json({ message: 'Car not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Rate a car
// @route   POST /api/cars/:id/rate
// @access  Public
router.post('/:id/rate', async (req, res) => {
    try {
        const { rating, comment, userName } = req.body;
        const car = await Car.findById(req.params.id);

        if (car) {
            const newRating = {
                rating: Number(rating),
                comment,
                userName,
                createdAt: new Date()
            };

            car.ratings.push(newRating);

            // Recalculate average rating
            const totalRating = car.ratings.reduce((sum, item) => sum + item.rating, 0);
            car.averageRating = totalRating / car.ratings.length;

            await car.save();
            res.status(201).json({ message: 'Rating added successfully', averageRating: car.averageRating });
        } else {
            res.status(404).json({ message: 'Car not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Delete car
// @route   DELETE /api/cars/:id
// @access  Private/Admin
router.delete('/:id', protect, async (req, res) => {
    try {
        const car = await Car.findById(req.params.id);
        if (car) {
            await car.deleteOne();
            res.json({ message: 'Car removed successfully' });
        } else {
            res.status(404).json({ message: 'Car not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
