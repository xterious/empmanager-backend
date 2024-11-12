const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
require("dotenv").config();
function authenticateAdmin(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null)
    return res
      .status(401)
      .json({ message: "Token not found! Provide auth token." });

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: err.message });
    req.user = user;
    next();
  });
}
const generateAccessToken = (user) => {
  const payload = {
    id: user.id,       
    email: user.email 
  };
  return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "15m",
  });
};

const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

const verifyPassword = async (inputPassword, storedPasswordHash) => {
  return await bcrypt.compare(inputPassword, storedPasswordHash);
};

module.exports = {
  authenticateAdmin,
  generateAccessToken,
  hashPassword,
  verifyPassword,
};
