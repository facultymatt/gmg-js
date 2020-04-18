const express = require("express");

import { COMMANDS, HEX_COMMANDS } from "./constants";
import { sendOnce, latestStatus } from "./grill-polling";
import requireCode from "./middleware/requireCode";
import sendCommand from "./middleware/sendCommand";
import jsonCommandSuccessMsg from "./middleware/jsonCommandSuccessMsg";

const app = express();

app.get("/", function (req, res) {
  res.send("Hello World!");
});

// power
app.get(
  "/on",
  requireCode,
  sendCommand(COMMANDS.powerOn),
  jsonCommandSuccessMsg("on")
);
app.get(
  "/off",
  requireCode,
  sendCommand(COMMANDS.powerOff),
  jsonCommandSuccessMsg("off")
);
app.get(
  "/coldSmoke",
  requireCode,
  sendCommand(COMMANDS.powerOnColdSmoke),
  jsonCommandSuccessMsg("coldSmoke")
);

// temp
app.get(
  "/grill",
  requireCode,
  sendCommand((req) => COMMANDS.setGrillTempF(req.query.temp)),
  jsonCommandSuccessMsg((req) => `grill temp ${req.query.temp}`)
);

app.get(
  "/probe1",
  requireCode,
  sendCommand((req) => COMMANDS.setProbe1TempF(req.query.temp)),
  jsonCommandSuccessMsg((req) => `probe1 temp ${req.query.temp}`)
);

app.get(
  "/probe2",
  requireCode,
  sendCommand((req) => COMMANDS.setProbe2TempF(req.query.temp)),
  jsonCommandSuccessMsg((req) => `probe2 temp ${req.query.temp}`)
);

// settings
app.get(
  "/pizza",
  requireCode,
  sendCommand(HEX_COMMANDS.setPizzaMode(latestStatus().settings), "hex"),
  jsonCommandSuccessMsg("pizza mode")
);

app.get(
  "/regular",
  requireCode,
  sendCommand(HEX_COMMANDS.setRegularMode(latestStatus().settings), "hex"),
  jsonCommandSuccessMsg("regular mode")
);

// error handler
app.use(function (err, req, res, next) {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

module.exports = app;
