const express = require("express");
const router = express.Router();

const {
	list,
	create,
	update,
	remove,
	monthly,
} = require("../controllers/dashboard");

router.get("/", list);
router.get("/incomes/filter/:year/:month", monthly);
router.post("/create", create);
router.post("/update/:id", update);
router.get("/delete/:id", remove);

module.exports = router;
