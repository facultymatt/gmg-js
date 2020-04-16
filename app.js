const express = require("express");

import { COMMANDS, HEX_COMMANDS } from "./constants";
import { sendOnce } from "./grill-polling";
import requireCode from "./middleware/requireCode";
import sendCommandAndJson from "./middleware/sendCommandAndJson";

const app = express();

app.get("/", function (req, res) {
  res.send("Hello World!");
});

// basic commands easy peasy
app.get("/on", requireCode, sendCommandAndJson(COMMANDS.powerOn, "on"));
app.get("/off", requireCode, sendCommandAndJson(COMMANDS.powerOff, "off"));
app.get(
  "/coldSmoke",
  requireCode,
  sendCommandAndJson(COMMANDS.powerOnColdSmoke, "cold smoke")
);

// commands that take params
app.get("/grill", function (req, res) {
  const temp = req.query.temp || 0;
  sendOnce(COMMANDS.setGrillTempF(temp));
  res.send(`Set grill temp ${temp}`);
});

app.get("/probe1", function (req, res) {
  const temp = req.query.temp || 0;
  sendOnce(COMMANDS.setProbe1TempF(temp));
  res.send(`Set probe1 temp ${temp}`);
});

app.get("/probe2", function (req, res) {
  const temp = req.query.temp || 0;
  sendOnce(COMMANDS.setProbe2TempF(temp));
  res.send(`Set probe2 temp ${temp}`);
});

// commands that set settings - tricky!
app.get("/pizza", function (req, res) {
  sendOnce(HEX_COMMANDS.setPizzaMode(status.settings), "hex");
  res.send("Pizza mode?");
});

app.get("/regular", function (req, res) {
  sendOnce(HEX_COMMANDS.setRegularMode(status.settings), "hex");
  res.send("regular mode?");
});

// error handler
app.use(function (err, req, res, next) {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

module.exports = app;
