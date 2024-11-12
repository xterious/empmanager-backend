const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      match: /.+\@.+\..+/,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    mobile: {
      type: String,
      required: true,
      match: [/^\d{10}$/, "Invalid phone number format"],
    },
    designation: {
      type: String,
    },
    gender: {
      type: String,
      required: true,
    },
    course: {
      type: Array,
    },
    img: {
      type: String,
      required: true,
    },
    enabled: {
      type: Boolean,
      default: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

const Employee = mongoose.model("employee", employeeSchema);

module.exports = Employee;
