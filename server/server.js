const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const config = require("./config.js");
const axios = require("axios");

const app = express();

app.use(express.json());
app.use(cors());

// Connecting to MongoDB
const url = `mongodb+srv://${config.dbusername}:${config.dbpassword}@cluster0.gi6wfsy.mongodb.net/?retryWrites=true&w=majority`;
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

// Start the server
const port = process.env.PORT || 5000;
app.listen(port, () => {
	console.log(`Server is running on port: ${port}`);
});
