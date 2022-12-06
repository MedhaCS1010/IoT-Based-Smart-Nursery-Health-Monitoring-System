const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const plantSchema = new Schema({
	name: {
		type: String,
		required: true,
	},
	description: {
		type: String,
		required: true,
	},
	category: {
		type: String,
		required: true,
	},
	created: {
		type: Date,
		default: Date.now,
	},
});

const Plant = mongoose.model("Plant", plantSchema);

module.exports = Plant;
