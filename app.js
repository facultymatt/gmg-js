const express = require("express");
const randomWords = require("random-words");
import { COMMANDS, HEX_COMMANDS } from "./constants";
import { sendOnce } from "./grill-polling";

const app = express();

app.get("/", function (req, res) {
  res.send("Hello World!");
});

app.get("/on", function (req, res) {
  sendOnce(COMMANDS.powerOn);
  res.send("On grill!");
});

let code;

const newCode = () => {
  code = randomWords({
    exactly: 1,
    formatter: (word) => word.toLowerCase(),
  })[0];
};

app.get("/off", function (req, res) {
  if (req.query.code) {
    if (req.query.code === code) {
      newCode();
      sendOnce(COMMANDS.powerOff);
      return res.json({
        message: "Sent grill off command",
      });
    }
    return res.status(403).json({
      message: "invalid code",
    });
  }
  newCode();
  return res.json({
    code,
  });

  // sendOnce(COMMANDS.powerOff);
  // res.send("Off grill!");
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
