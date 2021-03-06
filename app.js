import express from "express";
import cors from "cors";

import { temp, power, settings } from "./routes";

const app = express();

app.use(cors());

app.use("/command/power", power);
app.use("/command/temp", temp);
app.use("/command/settings", settings);

// basic error handler
app.use(function (err, req, res, next) {
  console.error(err.stack);
  res.status(500).json({
    message: "Error!",
  });
});

module.exports = app;
