const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const morgan = require("morgan");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();

mongoose
  .connect(
    "mongodb+srv://qayyuma686:123@cluster0.qqz3nau.mongodb.net/confidant-lounge",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then((res) => console.log("Connected to MongoDb"))
  .catch((err) => console.log("MongoDb connection Error", err));

app.use(morgan("dev"));
app.use(
  cors({
    origin: "*",
  })
);
app.use(bodyParser({ limit: "50mb" }));
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: false, limit: "50mb" }));
app.use("/img", express.static("./api/Images"));
app.use(function (req, res, next) {
  res.header("access-control-allow-credentials", true);
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});
console.log("ok2");
const userRouterFile = require("./api/routes/users");
const gameRouterFile = require("./api/routes/game");
app.use("/user", userRouterFile.router);

app.use("/game", gameRouterFile.router);

app.use("/hello", (req, res, next) => {
  console.log("ok");
  res.status(200).json({
    message: "hello world",
  });
});

module.exports = app;
