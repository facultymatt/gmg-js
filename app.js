import express from 'express';

import { temp, power, settings } from "./routes";

const app = express();

app.use("/power", power);
app.use("/temp", temp);
app.use("/settings", settings);

// basic error handler
app.use(function (err, req, res, next) {
  console.error(err.stack);
  res.status(500).json({
    message: "Error!"
  });
});

module.exports = app;
