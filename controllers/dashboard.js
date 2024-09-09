const Income = require("../models/dashboard");

// List all income/expenses
exports.list = async (req, res, next) => {
	try {
		const incomes = await Income.find({});
		res.render("dashboard", { incomes });
	} catch (error) {
		console.error("Error listing incomes:", error);
		res.status(500).send("Internal Server Error");
	}
};

// Create new income/expense entry
exports.create = async (req, res, next) => {
	try {
		const { date, type, title, amount } = req.body;
		const income = await Income.create({
			date,
			type,
			title,
			amount,
			duedate: new Date().toISOString(),
		});
		res.status(201).redirect("/");
	} catch (error) {
		console.error("Error creating income/expense:", error);
		res.status(500).send("Internal Server Error");
	}
};

// Generate a monthly report
exports.monthly = async (req, res, next) => {
	try {
		let { month, year } = req.params;

		// Parse month and year as integers
		month = parseInt(month, 10);
		year = parseInt(year, 10);

		// Validate the month and year
		if (!month || !year || month < 1 || month > 12 || isNaN(year)) {
			return res.status(400).send("Invalid month or year");
		}

		// Get the start and end of the month
		const startOfMonth = new Date(year, month - 1, 1).toISOString(); // First day of the month
		const endOfMonth = new Date(year, month, 0, 23, 59, 59, 999).toISOString(); // Last day of the month

		console.log("Start of Month:", startOfMonth);
		console.log("End of Month:", endOfMonth);

		// Find incomes/expenses within the month using the correct date range
		const records = await Income.find({
			date: {
				$gte: new Date(startOfMonth),
				$lte: new Date(endOfMonth),
			},
		}).exec(); // เพิ่ม `.exec()` เพื่อให้แน่ใจว่าคำสั่ง query ถูกดำเนินการ

		// Debugging output
		console.log("Fetched Records:", records);

		// Calculate total income and expenses
		const totalIncome = records
			.filter((record) => record.type === "income")
			.reduce((acc, curr) => acc + parseFloat(curr.amount || 0), 0);

		const totalExpenses = records
			.filter((record) => record.type === "expense")
			.reduce((acc, curr) => acc + parseFloat(curr.amount || 0), 0);

		// Calculate balance (income - expenses)
		const balance = totalIncome - totalExpenses;

		// Render the report with calculated data
		res.render("report", {
			records,
			totalIncome,
			totalExpenses,
			balance,
		});
	} catch (error) {
		console.error("Error generating monthly report:", error);
		res.status(500).send("Internal Server Error");
	}
};

// Update an income/expense entry
exports.update = async (req, res, next) => {
	try {
		const { id } = req.params;
		const { date, type, title, amount } = req.body;

		const income = await Income.findByIdAndUpdate(
			id,
			{
				date,
				type,
				title,
				amount,
				updatedAt: new Date().toISOString(), // Add updated timestamp
			},
			{ new: true }
		); // `new: true` returns the updated document

		if (!income) {
			return res.status(404).send("Income/Expense not found");
		}
		res.status(200).redirect("/");
	} catch (error) {
		console.error("Error updating income/expense:", error);
		res.status(500).send("Internal Server Error");
	}
};

// Delete an income/expense entry
exports.remove = async (req, res, next) => {
	try {
		const { id } = req.params;
		const income = await Income.findByIdAndDelete(id);

		if (!income) {
			return res.status(404).send("Income/Expense not found");
		}
		res.status(200).redirect("/");
	} catch (error) {
		console.error("Error deleting income/expense:", error);
		res.status(500).send("Internal Server Error");
	}
};
