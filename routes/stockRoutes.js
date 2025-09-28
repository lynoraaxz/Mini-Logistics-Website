const express = require("express");
const router = express.Router();
const {
  getStockMovement
} = require("../controllers/stockController");

router.get("/movement", getStockMovement);

module.exports = router;
