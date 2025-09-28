const sql = require("mssql");
const dbConfig = require("../db");

// GET ALL
exports.getEmployees = async (_req, res) => {
  try {
    let pool = await sql.connect(dbConfig);
    let result = await pool.request().query("SELECT * FROM Employees");
    return res.send(result.recordset);
  } catch (err) {
    console.error(err);
    return res.status(500).send({ success: false, error: err.message });
  }
};

// GET BY ID
exports.getEmployeeById = async (req, res) => {
  const { id } = req.params;
  try {
    let pool = await sql.connect(dbConfig);
    let result = await pool
      .request()
      .input("id", sql.Int, id)
      .query("SELECT * FROM Employees WHERE EmployeeID=@id");

    if (result.recordset.length === 0) {
      return res.status(404).send({ success: false, message: "Employee not found" });
    }
    return res.send(result.recordset[0]);
  } catch (err) {
    console.error(err);
    return res.status(500).send({ success: false, error: err.message });
  }
};

// CREATE
exports.createEmployee = async (req, res) => {
  const { Name, Position, Username, Password } = req.body;
  try {
    let pool = await sql.connect(dbConfig);
    await pool
      .request()
      .input("Name", sql.NVarChar, Name)
      .input("Position", sql.NVarChar, Position)
      .input("Username", sql.NVarChar, Username)
      .input("Password", sql.NVarChar, Password)
      .query(
        "INSERT INTO Employees (Name, Position, Username, Password) VALUES (@Name, @Position, @Username, @Password)"
      );

    return res.send({ success: true, message: "Employee added!" });
  } catch (err) {
    console.error(err);
    return res.status(500).send({ success: false, error: err.message });
  }
};

// UPDATE
exports.updateEmployee = async (req, res) => {
  const { id } = req.params;
  const { Name, Position, Username, Password } = req.body;
  try {
    let pool = await sql.connect(dbConfig);
    let result = await pool
      .request()
      .input("id", sql.Int, id)
      .input("Name", sql.NVarChar, Name)
      .input("Position", sql.NVarChar, Position)
      .input("Username", sql.NVarChar, Username)
      .input("Password", sql.NVarChar, Password)
      .query(
        "UPDATE Employees SET Name=@Name, Position=@Position, Username=@Username, Password=@Password OUTPUT INSERTED.Name WHERE EmployeeID=@id"
      );

    if (result.rowsAffected[0] === 0) {
      return res.status(404).send({ success: false, message: "Employee not found" });
    }

    const updatedName = result.recordset[0].Name;
    return res.send({ success: true, message: `Employee ${updatedName} updated!` });
  } catch (err) {
    console.error(err);
    return res.status(500).send({ success: false, error: err.message });
  }
};

// PATCH
exports.patchEmployee = async (req, res) => {
  const { id } = req.params;
  const { Name, Position, Username, Password } = req.body;
  try {
    let pool = await sql.connect(dbConfig);

    let updates = [];
    let request = pool.request().input("id", sql.Int, id);

    if (Name !== undefined) {
      updates.push("Name=@Name");
      request.input("Name", sql.NVarChar, Name);
    }
    if (Position !== undefined) {
      updates.push("Position=@Position");
      request.input("Position", sql.NVarChar, Position);
    }
    if (Username !== undefined) {
      updates.push("Username=@Username");
      request.input("Username", sql.NVarChar, Username);
    }
    if (Password !== undefined) {
      updates.push("Password=@Password");
      request.input("Password", sql.NVarChar, Password);
    }

    if (updates.length === 0) {
      return res.status(400).send({ success: false, message: "No fields to update" });
    }

    const query = `UPDATE Employees SET ${updates.join(", ")} OUTPUT INSERTED.Name WHERE EmployeeID=@id`;
    const result = await request.query(query);

    if (result.rowsAffected[0] === 0) {
      return res.status(404).send({ success: false, message: "Employee not found" });
    }

    const updatedName = result.recordset[0].Name;
    return res.send({ success: true, message: `Employee ${updatedName} patched!` });
  } catch (err) {
    console.error(err);
    return res.status(500).send({ success: false, error: err.message });
  }
};

// DELETE
exports.deleteEmployee = async (req, res) => {
  const { id } = req.params;
  try {
    let pool = await sql.connect(dbConfig);
    const result = await pool
      .request()
      .input("id", sql.Int, id)
      .query("DELETE FROM Employees WHERE EmployeeID=@id");

    if (result.rowsAffected[0] === 0) {
      return res.status(404).send({ success: false, message: "Employee not found" });
    }

    return res.send({ success: true, message: "Employee deleted!" });
  } catch (err) {
    console.error(err);
    return res.status(500).send({ success: false, error: err.message });
  }
};

// LOGIN
exports.login = async (req, res) => {
  const { Username, Password } = req.body;
  try {
    let pool = await sql.connect(dbConfig);
    let result = await pool
      .request()
      .input("Username", sql.NVarChar, Username)
      .input("Password", sql.NVarChar, Password)
      .query("SELECT * FROM Employees WHERE Username=@Username AND Password=@Password");

    if (result.recordset.length === 0) {
      return res.status(401).send({ success: false, message: "Invalid credentials" });
    }

    const user = result.recordset[0];
    return res.send({ success: true, message: "Login successful", user });
  } catch (err) {
    console.error(err);
    return res.status(500).send({ success: false, error: err.message });
  }
};

// REGISTER 

exports.regis = async (req, res) => {
  const { Name, Position, Username, Password } = req.body;

  // 1. Validasi input
  if (!Name || !Position || !Username || !Password) {
    return res.status(400).send("⚠️ All fields are required!");
  }

  try {
    let pool = await sql.connect(dbConfig);

    // 3. Simpan ke DB
    await pool.request()
      .input("Name", Name)
      .input("Position", Position)
      .input("Username", Username)
      .input("Password", Password)
      .query("INSERT INTO employees (Name, Position, Username, Password) VALUES (@Name, @Position, @Username, @Password)");

    res.status(201).json({ message: "✅ Employee registered successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).send("❌ Failed to register user");
  }
};

  // Ambil profil user berdasarkan username
exports.getProfile = async (req, res) => {
  try {
    const { username } = req.query;
    console.log("👉 Username dari query:", username); // debug

    let pool = await sql.connect(dbConfig);
    const result = await pool
      .request()
      .input("Username", sql.NVarChar, username)
      .query("SELECT Name, Position, Username FROM Employees WHERE Username = @Username");

    console.log("👉 SQL result:", result.recordset); // debug

    if (result.recordset.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(result.recordset[0]);
  } catch (err) {
    console.error("❌ Error fetching profile:", err);
    res.status(500).json({ message: "Error fetching profile" });
  }
};

