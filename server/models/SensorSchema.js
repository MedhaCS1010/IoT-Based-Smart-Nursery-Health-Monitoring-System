// Mongoose schema to store moisture, temperature, humidity and light data for each plant

const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const sensorSchema = new Schema({
	moisture: {
		type: Number,
		required: true,
	},
	temperature: {
		type: Number,
		required: true,
	},
	humidity: {
		type: Number,
		required: true,
	},
	light: {
		type: Number,
		required: true,
	},
	timestamp: {
		type: Date,
		required: true,
		default: Date.now,
	},
	plant: {
		type: Schema.Types.ObjectId,
		ref: "Plant",
	},
});

const Sensor = mongoose.model("Sensor", sensorSchema);

module.exports = Sensor;
