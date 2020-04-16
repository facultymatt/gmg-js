const express = require("express");

import { COMMANDS, HEX_COMMANDS } from "./constants";
import { sendOnce } from "./grill-polling";
import requireCode from "./middleware/requireCode";

const app = express();

app.get("/", function (req, res) {
  res.send("Hello World!");
});

app.get("/on", function (req, res) {
  sendOnce(COMMANDS.powerOn);
  res.send("On grill!");
});

app.get("/off", requireCode, (req, res) => {
  sendOnce(COMMANDS.powerOff);
  return res.json({
    message: "Sent grill off command",
  });
});

app.get("/pizza", function (req, res) {
  sendOnce(HEX_COMMANDS.setPizzaMode(status.settings), "hex");
  res.send("Pizza mode?");
});

app.get("/regular", function (req, res) {
  sendOnce(HEX_COMMANDS.setRegularMode(status.settings), "hex");
  res.send("regular mode?");
});

app.get("/coldSmoke", function (req, res) {
  sendOnce(COMMANDS.powerOnColdSmoke);
  res.send("Power on cold smoke");
});

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

app.use(function (err, req, res, next) {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

module.exports = app;
