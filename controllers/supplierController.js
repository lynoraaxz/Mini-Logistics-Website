// controllers/supplierController.js
const sql = require("mssql");
const dbConfig = require("../db");

// Get all suppliers
exports.getSuppliers = async (_req, res) => {
  try {
    const pool = await sql.connect(dbConfig);
    const result = await pool.request().query(`
      SELECT SupplierID, SupplierName, ContactPerson, Phone, Email, Address
      FROM Supplier
      ORDER BY SupplierID ASC
    `);
    res.json(result.recordset);
  } catch (err) {
    console.error("Error fetching suppliers:", err);
    res.status(500).send("Server error");
  }
};
