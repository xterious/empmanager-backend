const express = require("express");
const employeeController = require("../controllers/employeeController");
const { authenticateAdmin } = require("../utils");

const router = express.Router();

router.post(
  "/create-employee",
  authenticateAdmin,
  employeeController.createEmployee
);
router.get(
  "/get-employees",
  authenticateAdmin,
  employeeController.getEmployees
);
router.get(
  "/get-employee/:id",
  authenticateAdmin,
  employeeController.getEmployee
);
router.put(
  "/update-employee/:id",
  authenticateAdmin,
  employeeController.updateEmployee
);
router.delete(
  "/delete-employee/:id",
  authenticateAdmin,
  employeeController.deleteEmployee
);
router.patch(
  "/enable-employee/:id",
  authenticateAdmin,
  employeeController.enableEmployee
);
router.patch(
  "/disable-employee/:id",
  authenticateAdmin,
  employeeController.disableEmployee
);

module.exports = router;
