const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env") }); // Adjust path if .env is in project root

const { faker } = require("@faker-js/faker");
const mongoose = require("mongoose");
const Listing = require("../models/listing");
0
async function seedDB(n = 10) {
    try {
        await Listing.deleteMany({});
        console.log("Listings collection cleared.");

        const sampleData = [];

        for (let i = 0; i < n; i++) {
            sampleData.push({
                title: `${faker.location.city()} ${faker.helpers.arrayElement(['Villa', 'Cabin', 'Loft', 'Cottage', 'Mansion'])}`,
                description: faker.lorem.paragraph(),
                image: `https://loremflickr.com/800/600/house,realestate/all?lock=${i}`,
                price: faker.number.int({ min: 100000, max: 999999999 }),
                location: faker.location.city(),
                country: faker.location.country()
            });
        }

        await Listing.insertMany(sampleData);
        console.log(`Database seeded successfully with ${n} listings!`);
    } catch (err) {
        console.error("Seeding error:", err);
    } finally {
        // Correct way to close active connection
        await mongoose.connection.close();
        console.log("Database connection closed.");
    }
}

async function connectDB(count) {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to MongoDB Atlas for Seeding!");

        // Pass count into seedDB
        await seedDB(count);
    } catch (err) {
        console.error("Database connection failed:", err);
        process.exit(1);
    }
}

// Pass desired count here
connectDB(100);