const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Car = require('../models/Car');
const Customer = require('../models/Customer');
const Order = require('../models/Order');
const Analytics = require('../models/Analytics');

const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env') });

const cars = [
    {
        name: "Range Rover Sport",
        brand: "Land Rover",
        category: "SUV",
        model: "SVR",
        year: 2023,
        price: "$120,000",
        transmission: "Automatic",
        fuelType: "Petrol",
        mileage: "5,000 km",
        description: "The pinnacle of performance and luxury. This Range Rover Sport SVR combines off-road capability with track-inspired performance.",
        featured: true,
        status: "Available",
        views: 1250,
        features: ["Panoramic Sunroof", "360 Camera", "Meridian Sound System", "Heated Seats"],
        images: ["https://images.unsplash.com/photo-1606611013016-969c19ba27bb?q=80&w=1000&auto=format&fit=crop"]
    },
    {
        name: "Toyota Land Cruiser 300",
        brand: "Toyota",
        category: "SUV",
        model: "GR Sport",
        year: 2024,
        price: "$95,000",
        transmission: "Automatic",
        fuelType: "Diesel",
        mileage: "1,200 km",
        description: "The legendary King of the Road. Unmatched reliability and luxury for Rwandan terrains.",
        featured: true,
        status: "Available",
        views: 980,
        features: ["4WD", "Leather Interior", "Cool Box", "Adaptive Cruise Control"],
        images: ["https://images.unsplash.com/photo-1594568284297-7c6446438dc0?q=80&w=1000&auto=format&fit=crop"]
    },
    {
        name: "Mercedes-Benz S-Class",
        brand: "Mercedes-Benz",
        category: "Sedan",
        model: "S580",
        year: 2022,
        price: "$110,000",
        transmission: "Automatic",
        fuelType: "Hybrid",
        mileage: "12,000 km",
        description: "The world's premier luxury sedan. A masterpiece of engineering and comfort.",
        featured: true,
        status: "Available",
        views: 850,
        features: ["Executive Rear Seating", "MBUX Interior Assistant", "Burmester 4D Sound"],
        images: ["https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?q=80&w=1000&auto=format&fit=crop"]
    },
    {
        name: "Tesla Model X",
        brand: "Tesla",
        category: "Electric",
        model: "Plaid",
        year: 2023,
        price: "$85,000",
        transmission: "Automatic",
        fuelType: "Electric",
        mileage: "3,000 km",
        description: "The fastest accelerating SUV in production. Experience the future of mobility with Falcon Wing doors.",
        featured: true,
        status: "Available",
        views: 2100,
        features: ["Autopilot", "Falcon Wing Doors", "Ludicrous Mode", "1020 HP"],
        images: ["https://images.unsplash.com/photo-1560958089-b8a1929cea89?q=80&w=1000&auto=format&fit=crop"]
    },
    {
        name: "Ford F-150 Raptor",
        brand: "Ford",
        category: "Truck",
        model: "Raptor R",
        year: 2024,
        price: "$105,000",
        transmission: "Automatic",
        fuelType: "Petrol",
        mileage: "800 km",
        description: "Baja-ready performance for any adventure. The ultimate off-road pickup truck.",
        featured: false,
        status: "Available",
        views: 1560,
        features: ["Fox Live Valve Shocks", "37-inch Tires", "Recaro Seats"],
        images: ["https://images.unsplash.com/photo-1583121274602-3e2820c69888?q=80&w=1000&auto=format&fit=crop"]
    },
    {
        name: "BMW X7",
        brand: "BMW",
        category: "SUV",
        model: "M60i",
        year: 2023,
        price: "$115,000",
        transmission: "Automatic",
        fuelType: "Petrol",
        mileage: "4,500 km",
        description: "Spacious luxury with BMW's signature driving dynamics. Premium interior with three rows of comfort.",
        featured: false,
        status: "Available",
        views: 740,
        features: ["Sky Lounge Ceiling", "Bowers & Wilkins Sound", "Integral Active Steering"],
        images: ["https://images.unsplash.com/photo-1555215695-3004980ad54e?q=80&w=1000&auto=format&fit=crop"]
    }
];

const customers = [
    { name: "Sano Emmanuel", email: "sano@example.com", phone: "+250788123456", whatsapp: "+250788123456", location: "Kigali", language: "English", method: "Whatsapp" },
    { name: "Uwase Alice", email: "alice@example.com", phone: "+250788654321", whatsapp: "+250788654321", location: "Nyamata", language: "Kinyarwanda", method: "Email" },
    { name: "John Doe", email: "john@example.com", phone: "+250788000111", whatsapp: "+250788000111", location: "Kigali", language: "English", method: "Call" }
];

const seedData = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB for seeding...');

        // Clear existing data
        await Car.deleteMany({});
        await Customer.deleteMany({});
        await Order.deleteMany({});
        await Analytics.deleteMany({});
        console.log('Cleared existing data.');

        // Insert Cars
        const createdCars = await Car.insertMany(cars);
        console.log(`Inserted ${createdCars.length} cars.`);

        // Insert Customers
        const createdCustomers = await Customer.insertMany(customers);
        console.log(`Inserted ${createdCustomers.length} customers.`);

        // Create Inquiries (Orders)
        const inquiries = [
            { customer: createdCustomers[0]._id, car: createdCars[0]._id, status: 'new', source: 'website' },
            { customer: createdCustomers[1]._id, car: createdCars[1]._id, status: 'in_progress', source: 'whatsapp' },
            { customer: createdCustomers[2]._id, car: createdCars[2]._id, status: 'new', source: 'website' },
            { customer: createdCustomers[0]._id, car: createdCars[3]._id, status: 'completed', source: 'website' }
        ];
        await Order.insertMany(inquiries);
        console.log('Inserted inquiries.');

        // Seed Analytics (Last 7 Days)
        const analyticsData = [];
        const deviceTypes = ['Desktop', 'Mobile', 'Tablet'];
        const pages = ['/', '/cars', '/about', '/contact'];

        for (let i = 0; i < 7; i++) {
            const date = new Date();
            date.setDate(date.getDate() - i);

            // Random number of views per day between 50 and 200
            const viewsCount = Math.floor(Math.random() * 150) + 50;

            for (let j = 0; j < viewsCount; j++) {
                analyticsData.push({
                    page: pages[Math.floor(Math.random() * pages.length)],
                    deviceType: deviceTypes[Math.floor(Math.random() * deviceTypes.length)],
                    ip: `192.168.1.${Math.floor(Math.random() * 255)}`,
                    country: 'Rwanda',
                    createdAt: date
                });
            }
        }
        await Analytics.insertMany(analyticsData);
        console.log(`Inserted ${analyticsData.length} analytics records.`);

        console.log('Data Seeding Completed Successfully!');
        process.exit();
    } catch (error) {
        console.error('Error seeding data:', error);
        process.exit(1);
    }
};

seedData();
