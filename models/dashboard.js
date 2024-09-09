const mongoose = require("mongoose");

const incomeSchema = new mongoose.Schema(
	{
		date: { type: String },
		type: { type: String },
		title: { type: String },
		amount: { type: Number },
		duedate: { type: String },
	},
	{ timestamps: true }
);

const Income = mongoose.model("Income", incomeSchema);

module.exports = Income;
