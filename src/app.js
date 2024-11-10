const express = require("express");
const app = express();
const cors = require("cors");
const employeeRoutes = require("./routes/employeeRouter");
// const adminRoutes = require("./routes/adminRouter");
const { logReqRes } = require("./middlewares");
const { connectMongoDb } = require("./services/Mongodb");

app.use(cors());
app.use(express.json());
connectMongoDb();
app.use(logReqRes("./log.txt"));
let refreshToken = [];

// app.post("/token", (req, res) => {
//   const refreshToken = req.body.token;
//   if (refreshToken == null) return res.sendStatus(401);
//   jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
//     if (err) return res.sendStatus(403);
//     const accessToken = generateAccessToken({ email: user.email });
//     res.json({ accessToken: accessToken });
//   });
// });

app.use("/api/employees", employeeRoutes);
// app.use("/api/admin", adminRoutes);

module.exports = app;
