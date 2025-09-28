const express = require("express");
const router = express.Router();
const {
  getEmployees,
  getEmployeeById,
  createEmployee,
  updateEmployee,
  patchEmployee,
  deleteEmployee,
  login, 
  regis,
  getProfile,
} = require("../controllers/employeesController");

router.get("/", getEmployees);
router.get("/profile", getProfile);
router.get("/:id", getEmployeeById);
router.post("/", createEmployee);
router.put("/:id", updateEmployee);
router.patch("/:id", patchEmployee);
router.delete("/:id", deleteEmployee);
router.post("/login", login);
router.post("/regis", regis);


module.exports = router;
