const express = require("express");
const app = express();
const port = 3000;
const methodOverride = require("method-override");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');

app.use(methodOverride("_method"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.engine('ejs', ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
 
const Listing = require("./models/listing.js");

let reqID = 1; 
app.use((req, res, next) => {
    console.log(`[Request #${reqID++}] ${req.method} ${req.url}`);
    next();
});

// root route
app.get("/", (req, res) => {
    res.send("root is working for WanderSpace");
});

// index route
app.get("/listings", async (req, res) => {
    const allListings = await Listing.find();
    res.render("index.ejs", {allListings});
});

// new route
app.get("/listings/new", (req, res) => {
    res.render("new");
});

// create route
app.post("/listings", async (req, res) => {
    let listing = req.body.listing;
    await Listing.insertOne(listing);
    res.redirect("/listings");
});

// show route
app.get("/listings/:id", async (req, res) => {
    let {id} = req.params;
    const data = await Listing.findById(id);
    res.render("show.ejs", {listing: data});
});

// edit route
app.get("/listings/:id/edit", async (req, res) => {
    let {id} = req.params;
    const data = await Listing.findById(id);
    res.render("edit.ejs", {listing: data});
});

// update route
app.put("/listings/:id", async (req, res) => {
    let {id} = req.params;
    let data = req.body.listing;
    console.log(data);
    await Listing.findByIdAndUpdate(id, {...data}, {runValidators: true});
    res.redirect("/listings");
});

// delete route
app.delete("/listings/:id", async (req, res) => {
    let {id} = req.params;
    const data = await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
});

// database connection and server listener
async function connectDB() {
    try{
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to MongoDB Atlas!");

        app.listen(port, () => {
            console.log(`Server is live at Port: ${port}`);
        });
    } catch (err) {
        console.error("Database connection failed:", err);
        process.exit(1);
    }
}

connectDB();


