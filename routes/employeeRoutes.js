const express = require("express");
const Employee = require("../models/Employee");
const auth = require("../middleware/authMiddleware");

const router = express.Router();

/* CREATE employee */
router.post("/", auth, async (req, res) => {
  try {
    const employee = await Employee.create(req.body);
    res.status(201).json(employee);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

/* READ all employees */
router.get("/", auth, async (req, res) => {
  const employees = await Employee.find();
  res.json(employees);
});

/* UPDATE employee */
router.put("/:id", auth, async (req, res) => {
  const updatedEmployee = await Employee.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );
  res.json(updatedEmployee);
});

/* DELETE employee */
router.delete("/:id", auth, async (req, res) => {
  await Employee.findByIdAndDelete(req.params.id);
  res.json({ message: "Employee deleted" });
});

module.exports = router;
