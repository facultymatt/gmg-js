import express from "express";

import { temp, power, settings } from "./api";

const app = express();

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
