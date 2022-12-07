const express = require("express");
const mongoose = require("mongoose");
const config = require("./config.js");
const axios = require("axios");

const Plant = require("./models/PlantSchema");
const Water = require("./models/WaterSchema");

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

// Ideal readings of each sensor
// Moisture: >=70 (Best) & 51-69 (Good), <=50 (Bad)
// Temperature: <50 & >5 (Ideal)
// Humidity: >50 (Ideal)
// Light: >80 (Ideal)

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

// Enable watering system when request received from ESP32
app.get("/water", async (req, res) => {
	const { sensorId } = req.query;

	// Add watering timestamp to database
	try {
		const plant = await Plant.find({ sensorId });
		const newWaterData = new Water({
			plant: plant,
			startTimestamp: Date.now(),
			endTimestamp: Date.now() + 2000,
		});
		await newWaterData.save();
		res.send(true);
	} catch (err) {
		console.log(err);
		res.status(500).send(false);
	}
});

// Enable watering system when request received from client
app.get("/water/:id", async (req, res) => {
	const { plantId } = req.params;

	// Add watering timestamp to database
	try {
		const plant = await Plant.findById(plantId);
		const newWaterData = new Water({
			plant: plant,
			startTimestamp: Date.now(),
			endTimestamp: Date.now() + 2000,
		});
		await newWaterData.save();

		// AXIOS GET request to ESP32
		// Send sensorId to ESP32

		res.send(true);
	} catch (err) {
		console.log(err);
		res.status(500).send(false);
	}
});

// Start the server
const port = process.env.PORT || 5000;
app.listen(port, () => {
	console.log(`Server is running on port: ${port}`);
});
