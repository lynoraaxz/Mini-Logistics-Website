const express = require("express");
const router = express.Router();
const {
  getShipments
} = require("../controllers/shipmentController");

router.get("/movement", getShipments);

module.exports = router;
