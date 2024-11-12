require("dotenv").config();
const jwt = require("jsonwebtoken");
const { generateAccessToken } = require("../utils");
const { hashPassword } = require("../utils");
const { verifyPassword } = require("../utils");
const adminModel = require("../models/adminModel");

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(401)
        .json({ status: "Failed", message: "Provide email and password" });
    }

    const admin = await adminModel.findOne({ email });
    if (!admin) {
      return res
        .status(401)
        .json({ status: "Failed", message: "Invalid email or password" });
    }

    const isPasswordValid = await verifyPassword(password, admin.password);
    if (!isPasswordValid) {
      return res
        .status(401)
        .json({ status: "Failed", message: "Invalid email or password" });
    }
    const adminObject = admin.toObject();
    const accessToken = generateAccessToken(adminObject);
    const refreshToken = jwt.sign(
      { email: admin.email },
      process.env.REFRESH_TOKEN_SECRET
    );

    admin.refreshToken = refreshToken;
    await admin.save();

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      path: "/",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
    res.json({ accessToken });
    return res.status(200);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
const refreshToken = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) {
    return res.status(401).send("Refresh token is required");
  }
  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, async (err, user) => {
    if (err) {
      return res.status(403).send("Invalid or expired refresh token");
    }
    const accessToken = generateAccessToken(user);
    console.log(accessToken);
    return res.json({ accessToken });
  });
};
const logout = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      return res.sendStatus(204); // No content to clear
    }

    const admin = await adminModel.findOne({ refreshToken });
    if (!admin) {
      res.clearCookie("refreshToken", { path: "/" });
      return res.sendStatus(204);
    }

    // Clear refresh token in the database and cookie
    admin.refreshToken = "";
    await admin.save();
    res.clearCookie("refreshToken", { path: "/" });

    return res.sendStatus(204); // Successfully logged out
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const createAdmin = async (req, res) => {
  const { email, password, userName } = req.body;

  try {
    if (!email || !password || !userName) {
      return res.status(400).json({
        status: "Failed",
        message: "Provide email, password, and userName",
      });
    }

    // Check if email already exists
    const existingAdmin = await adminModel.findOne({ email });
    if (existingAdmin) {
      return res
        .status(409)
        .json({ status: "Failed", message: "Email already in use" });
    }

    const hashedPassword = await hashPassword(password);
    const result = await adminModel.create({
      email,
      password: hashedPassword,
      userName,
    });
    if (result) {
      return res
        .status(201)
        .json({ status: "Success", message: "Admin created successfully" });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

module.exports = {
  login,
  logout,
  refreshToken,
  createAdmin,
};
