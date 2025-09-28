// routes/shipment.js
const sql = require("mssql");
const dbConfig = require("../db");

// Get all shipments
exports.getShipments = async (_req, res) => {
  try {
    const pool = await sql.connect(dbConfig);
    const result = await pool.request().query(`
      SELECT ShipmentID, ShipmentDate, ShipmentType, PartnerName, ItemName, Quantity, Status
      FROM Shipment
      ORDER BY ShipmentID DESC
    `);

    res.json(result.recordset);
  } catch (err) {
    console.error("Error fetching shipments:", err);
    res.status(500).send("Server error");
  }
};
