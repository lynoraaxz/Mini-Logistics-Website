  const express = require("express");
  const sql = require("mssql");
  const dbConfig = require("./db");
  const employeeRoutes = require("./routes/employees");

  const cors = require("cors");

  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());

  // Routes
  app.use("/employees", employeeRoutes);

  const shipmentRoutes = require("./routes/shipmentRoutes");
  app.use("/shipments", shipmentRoutes);

  const supplierRoutes = require("./routes/supplierRoutes");
  app.use("/suppliers", supplierRoutes);

  const custRoutes = require("./routes/custRoutes");
  app.use("/cust", custRoutes);


  const stockRoutes = require("./routes/stockRoutes");
  app.use("/stock", stockRoutes);
  // Root endpoint
  app.get("/", (_req, res) => {
    res.send("✅ API is working and listening on port 3000");
  });

  // Start server
  async function startServer() {
    try {
      await sql.connect(dbConfig);
      console.log("✅ Database connected!");
    } catch (err) {
      console.error("❌ Database connection failed:", err.message);
    }

    app.listen(3000, () => {
      console.log("🚀 Server running on port 3000");
    });
  }

  startServer();
