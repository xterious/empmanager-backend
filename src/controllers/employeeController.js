const Employee = require("../models/employeeModel");
const createEmployee = async (req, res) => {
  try {
    const employee = req.body;
    if (
      !employee.name ||
      !employee.email ||
      !employee.mobile ||
      !employee.designation ||
      !employee.gender ||
      !employee.course ||
      !employee.img
    )
      return res.status(400).json({ message: "All fields are required" });
    const courses = Array.isArray(employee.course)
      ? employee.course
      : [employee.course];
    const newEmployee = await Employee.create({
      name: employee.name,
      email: employee.email,
      mobile: employee.mobile,
      designation: employee.designation,
      gender: employee.gender,
      course: courses,
      img: employee.img,
      enabled: true,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
    return res.status(201).json(newEmployee);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getEmployees = async (req, res) => {
  try {
    const employees = await Employee.find();
    return res.json(employees);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getEmployee = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);
    return res.json(employee);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const updateEmployee = async (req, res) => {
  try {
    const courses = Array.isArray(req.body.course)
      ? req.body.course
      : [req.body.course];
    await Employee.findByIdAndUpdate(
      req.params.id,
      {
        name: req.body.name,
        email: req.body.email,
        mobile: req.body.mobile,
        designation: req.body.designation,
        gender: req.body.gender,
        course: courses,
        img: req.body.img,
      },
      { new: true }
    );
    return res
      .status(200)
      .json({ status: "Success", message: "Updated successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const deleteEmployee = async (req, res) => {
  try {
    const employee = await Employee.findByIdAndDelete(req.params.id);
    return res.json({
      status: "Sucess",
      message: "Deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const enableEmployee = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);
    employee.enabled = true;
    await employee.save();
    return res.json(employee);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
const disableEmployee = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);
    employee.enabled = false;
    await employee.save();
    res.json(employee);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
module.exports = {
  createEmployee,
  getEmployees,
  getEmployee,
  updateEmployee,
  deleteEmployee,
  enableEmployee,
  disableEmployee,
};
