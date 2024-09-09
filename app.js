const express = require("express");
const { readdirSync } = require("fs");
const path = require("path");

const cors = require("cors");
const bodyParser = require("body-parser");
const app = express();
const port = 3000;

const connectDB = require("./config/db");
app.set("views", path.join(__dirname, "views")); // Use lowercase "views"
app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

readdirSync("./routes").map((r) => app.use("/", require("./routes/" + r)));

connectDB()
	.then(
		app.listen(port, () =>
			console.log(`Server is running on http://localhost:${port} `)
		)
	)
	.catch((err) => console.log(err));
