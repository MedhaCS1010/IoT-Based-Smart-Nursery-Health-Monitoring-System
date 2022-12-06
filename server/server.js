const express = require("express");
const mongoose = require("mongoose");
const config = require("./config.js");
const axios = require("axios");

const Plant = require("./models/PlantSchema");

const app = express();

app.use(express.json());

app.use(function (req, res, next) {
	res.setHeader("Access-Control-Allow-Origin", "*");
	res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
	res.setHeader("Access-Control-Allow-Headers", "Content-Type");
	res.setHeader("Access-Control-Allow-Credentials", true);
	next();
});

// Connecting to MongoDB
const url = `mongodb+srv://${config.dbusername}:${config.dbpassword}@cluster0.gi6wfsy.mongodb.net/plant-nursery?retryWrites=true&w=majority`;
const connectionParams = {
	useNewUrlParser: true,
	useUnifiedTopology: true,
};

mongoose
	.connect(url, connectionParams)
	.then(() => {
		console.log("Connected to database ");
	})
	.catch((err) => {
		console.error(`Error connecting to the database. \n${err}`);
	});

// Endpoints for obtaining moisture, temperature, and humidity data from ESP32
app.get("/moisture", (req, res) => {
	// AXIOS GET request to ESP32
	res.send("Moisture data");
});

app.get("/temperature", (req, res) => {
	// AXIOS GET request to ESP32
	res.send("Temperature data");
});

app.get("/humidity", (req, res) => {
	// AXIOS GET request to ESP32
	res.send("Humidity data");
});

app.get("/all", (req, res) => {
	// AXIOS GET request to ESP32
	res.send("All data");
});

// POST request to add new plant to database
app.post("/add", async (req, res) => {
	// const newPlant = req.body;

	const newPlant = new Plant({
		name: "SomePlant",
		description: "A flower",
		category: "Flower",
	});

	try {
		await newPlant.save();
		res.json(newPlant.toObject({ getters: true }));
	} catch (err) {
		console.log(err);
		res.status(500).send("Could not add plant to database");
	}
});

// GET request to retrieve all plants from database
app.get("/plants", async (req, res) => {
	try {
		const plants = await Plant.find();
		res.json(plants);
	} catch (err) {
		console.log(err);
		res.status(500).send("Could not retrieve plants from database");
	}
});

// GET request to retrieve plant by ID from database
app.get("/plants/:id", async (req, res) => {
	try {
		const plant = await Plant.findById(req.params.id);
		res.json(plant);
	} catch (err) {
		console.log(err);
		res.status(500).send("Could not retrieve plant from database");
	}
});

// PUT request to update plant by ID in database
app.put("/plants/:id", async (req, res) => {
	try {
		const plant = await Plant.findById(req.params.id);
		plant.name = req.body.name;
		plant.description = req.body.description;
		plant.category = req.body.category;
		await plant.save();
		res.json(plant);
	} catch (err) {
		console.log(err);
		res.status(500).send("Could not update plant in database");
	}
});

// DELETE request to delete plant by ID from database
app.delete("/plants/:id", async (req, res) => {
	try {
		const plant = await Plant.findById(req.params.id);
		await plant.remove();
		res.json(plant);
	} catch (err) {
		console.log(err);
		res.status(500).send("Could not delete plant from database");
	}
});

// Start the server
const port = process.env.PORT || 5000;
app.listen(port, () => {
	console.log(`Server is running on port: ${port}`);
});
