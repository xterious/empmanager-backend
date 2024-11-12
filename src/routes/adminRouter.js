const express = require("express");
const adminController = require("../controllers/adminController");

const router = express.Router();

router.post("/login", adminController.login);
router.post("/logout", adminController.logout);
router.post("/refresh-token", adminController.refreshToken);
// router.post("/create-admin", adminController.createAdmin);

module.exports = router;
