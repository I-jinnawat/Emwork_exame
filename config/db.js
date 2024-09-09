const mongoose = require("mongoose");

const DB =
	"mongodb+srv://6431503083:art999@cluster0.5oomu.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

const connectDB = async () => {
	console.log("connecting DB");
	try {
		await mongoose.connect(DB, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
		});
		console.log("DB connected");
	} catch (error) {
		console.error(`Can't connect to DB: ${error.message}`);
	}
};

module.exports = connectDB;
