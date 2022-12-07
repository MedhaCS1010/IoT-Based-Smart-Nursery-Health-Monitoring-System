const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const waterSchema = new Schema({
	moisture: {
		type: Number,
		required: true,
	},
	startTimestamp: {
		type: Date,
		required: true,
	},
	endTimestamp: {
		type: Date,
		required: true,
	},
	plant: {
		type: Schema.Types.ObjectId,
		ref: "Plant",
	},
});

const Water = mongoose.model("Water", waterSchema);

module.exports = Water;
