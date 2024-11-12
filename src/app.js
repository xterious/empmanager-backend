const express = require("express");
const app = express();
const cors = require("cors");
const cookieParser = require("cookie-parser");
const employeeRoutes = require("./routes/employeeRouter");
const adminRoutes = require("./routes/adminRouter");
const { logReqRes } = require("./middlewares");
const { connectMongoDb } = require("./services/Mongodb");

const corsOptions = {
  origin: "http://localhost:5173",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json());
connectMongoDb();
app.use(logReqRes("./log.txt"));

app.post("/token", (req, res) => {
  const refreshToken = req.body.token;
  if (refreshToken == null) return res.sendStatus(401);
  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    const accessToken = generateAccessToken({ email: user.email });
    res.json({ accessToken: accessToken });
  });
});
const swaggerUIPath = require("swagger-ui-express");
const swaggerjsonFilePath = require("../docs/swagger.json");

app.use(
  "/api-docs",
  swaggerUIPath.serve,
  swaggerUIPath.setup(swaggerjsonFilePath)
);
app.use("/api/employees", employeeRoutes);
app.use("/api/admin", adminRoutes);

module.exports = app;
