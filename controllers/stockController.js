const sql = require("mssql");
const dbConfig = require("../db");

exports.getStockMovement = async (_req, res) => {
  try {
    const pool = await sql.connect(dbConfig);

    const result = await pool.request().query(`
      SELECT 
        MONTH(TransactionDate) AS monthNumber,
        SUM(CASE WHEN Type = 'IN' THEN Quantity ELSE 0 END) AS stockIn,
        SUM(CASE WHEN Type = 'OUT' THEN Quantity ELSE 0 END) AS stockOut
      FROM StockTransaction
      GROUP BY MONTH(TransactionDate)
      ORDER BY MONTH(TransactionDate)
    `);

    const monthNames = [
      "January","February","March","April","May","June",
      "July","August","September","October","November","December"
    ];

    const labels = result.recordset.map(r => monthNames[r.monthNumber - 1]); // monthNumber: 1–12
    const stockIn = result.recordset.map(r => r.stockIn);
    const stockOut = result.recordset.map(r => r.stockOut);

    res.json({ labels, stockIn, stockOut });

  } catch (err) {
    console.error("❌ Error fetching stock movement:", err);
    res.status(500).json({ message: "Error fetching stock movement" });
  }
};
