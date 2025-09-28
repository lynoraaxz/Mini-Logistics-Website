const express = require("express");
const router = express.Router();
const { getCust } = require("../controllers/custController");

router.get("/list", getCust);

module.exports = router;
