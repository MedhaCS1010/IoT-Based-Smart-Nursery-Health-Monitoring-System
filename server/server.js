const express = require("express");
const mongoose = require("mongoose");
const config = require("./config.js");
const axios = require("axios");

const Plant = require("./models/PlantSchema");
const Water = require("./models/WaterSchema");
const Sensor = require("./models/SensorSchema");

const espIpAddress = "http://192.168.0.107/";

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
app.get("/moisture", async (req, res) => {
	// AXIOS GET request to ESP32
	var moisture;
	const response = await axios.get(`${espIpAddress}moisture`);
	moisture = response.data;
	res.json(moisture);
});

app.get("/temperature", async (req, res) => {
	// AXIOS GET request to ESP32
	var temperature;
	const response = await axios.get(`${espIpAddress}temperature`);
	temperature = response.data;
	res.json(temperature);
});

app.get("/humidity", async (req, res) => {
	// AXIOS GET request to ESP32
	var humidity;
	const response = await axios.get(`${espIpAddress}humidity`);
	humidity = response.data;
	res.json(humidity);
});

// Ideal readings of each sensor
// Moisture: >=70 (Best) & 51-69 (Good), <=50 (Bad)
// Temperature: <50 & >5 (Ideal)
// Humidity: >50 (Ideal)
// Light: >80 (Ideal)

app.get("/all/:plantId", async (req, res) => {
	// AXIOS GET request to ESP32 to obtain all sensor data

	console.log("Request received for sensor data");

	const plantId = req.params.plantId;
	var plant = null;
	var newSensor = null;

	var moisture = 2500;
	var temperature = 25;
	var humidity = 50;
	var light = 100;

	var moistureLimit = 3000;
	var temperatureLimit = 50;
	var humidityLowerLimit = 40;
	var humidityUpperLimit = 70;
	var lightLimit = 2000;

	try {
		plant = await Plant.findById(plantId);
	} catch (err) {
		console.log(err);
		res.status(500).json({ message: "Could not find plant" });
	}

	try {
		const response = await axios.get(`${espIpAddress}all`);
		console.log(response.data);
		const readings = response.data.split(",");

		// Convert string values from readings to integers
		moisture = parseInt(readings[0]);
		light = parseInt(readings[1]);
		temperature = parseInt(readings[2]);
		humidity = parseInt(readings[3]);

		if (
			moisture < moistureLimit &&
			temperature < temperatureLimit &&
			humidity > humidityLowerLimit &&
			humidity < humidityUpperLimit &&
			light > lightLimit
		) {
			console.log("Plant Healthy:)");
			await axios.get(`${espIpAddress}plantsafe`);
		} else {
			console.log("Plant Unhealthy:(");
			await axios.get(`${espIpAddress}plantunsafe`);
		}

		console.log(moisture, temperature, humidity, light);
	} catch (err) {
		console.log(err);
		res.status(500).json({ message: "Could not get sensor data" });
	}

	// Store sensor data in database
	if (plant) {
		newSensor = new Sensor({
			moisture: moisture,
			temperature: temperature,
			humidity: humidity,
			light: light,
			plant: plant,
		});

		try {
			await newSensor.save();
		} catch (err) {
			console.log(err);
			res.status(500).json({ message: "Could not save sensor data" });
			return;
		}
	}

	res.json(newSensor.toObject({ getters: true }));
});

// POST request to add new plant to database
app.post("/add", async (req, res) => {
	const nPlant = req.body;
	console.log(nPlant);

	// const newPlant = new Plant({
	// 	name: "SomeNewPlant",
	// 	description: "A flower",
	// 	category: "Flower",
	// 	size: "Small",
	// 	sensorId: 123,
	// });

	const newPlant = new Plant({
		name: nPlant.name,
		description: nPlant.description,
		category: nPlant.category,
		size: nPlant.size,
		sensorId: nPlant.sensorId,
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
		console.log("Received request for all plants");
		const plants = await Plant.find();
		res.json(plants.map((plant) => plant.toObject({ getters: true })));
	} catch (err) {
		console.log(err);
		res.status(500).send("Could not retrieve plants from database");
	}
});

// GET request to retrieve plant by ID from database
app.get("/plants/:plantId", async (req, res) => {
	try {
		console.log("Received request for plant");
		console.log(req.params.plantId);
		const plant = await Plant.findById(req.params.plantId);
		res.json(plant.toObject({ getters: true }));
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
app.get("/water/:plantId", async (req, res) => {
	const { plantId } = req.params;

	// Add watering timestamp to database
	try {
		const plant = await Plant.findById(plantId);
		const response = await axios.get(`${espIpAddress}moisture`);
		const moisture = response.data;
		const newWaterData = new Water({
			plant: plant,
			startTimestamp: Date.now(),
			endTimestamp: Date.now() + 2000,
			moisture: moisture,
		});
		await newWaterData.save();
		await axios.get(`${espIpAddress}waternow`);
		res.send(true);
	} catch (err) {
		console.log(err);
		res.status(500).send(false);
	}
});

// GET request to retrieve all sensor data from database for plant plantId
app.get("/sensors/:plantId", async (req, res) => {
	const { plantId } = req.params;

	try {
		const plant = await Plant.findById(plantId);
		const sensors = await Sensor.find({ plant: plant });
		res.json(sensors.map((sensor) => sensor.toObject({ getters: true })));
	} catch (err) {
		console.log(err);
		res.status(500).send("Could not retrieve sensor data from database");
	}
});

// Start the server
const port = process.env.PORT || 5000;
app.listen(port, () => {
	console.log(`Server is running on port: ${port}`);
});
