const mongoose = require('mongoose');

const listingSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Title is required'],
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    image: {
        type: String,
        default: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c",
        set: (v) => (v === "" || !v.startsWith("http")) ? "https://images.unsplash.com/photo-1600585154340-be6161a56a0c" : v
    },
    price: {
        type: Number,
        required: [true, 'Price is required'],
        default: 0,
        min: [0, 'Price cannot be negative']
    },
    location: {
        type: String,
        required: [true, 'Location is required'],
        trim: true
    },
    country: {
        type: String,
        required: [true, 'Country is required'],
        trim: true
    }
});

// Compile the schema into a Model
const Listing = mongoose.model('Listing', listingSchema);

// Export it for use in app.js
module.exports = Listing;