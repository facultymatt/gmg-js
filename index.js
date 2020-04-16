const dgram = require("dgram");
const express = require("express");
const GrillStatus = require("./GrillStatus");
const asciichart = require("asciichart");
const csvdb = require("csvdb");
import { PORT, IP, INTERVAL } from "./config";
import { COMMANDS, HEX_COMMANDS } from "./constants";
import * as store from "./datastore-pouch";

let status;

const app = express();
const socket = dgram.createSocket("udp4");

const renderChart = async () => {
  const history = await store.all();
  const data = history.map(({ currentProbe1Temp }) => currentProbe1Temp);
  console.clear();
  console.log(asciichart.plot(data, { height: 6 }));
};

socket.on("error", (err) => {
  console.error("error", err);
});

socket.on("message", async (msg, info) => {
  // console.log('message ====');
  // console.log(msg);
  // console.log(Buffer.from(msg).toString());
  // console.log(info);
  // console.log('end message ====');
  // @todo check for non grill status messages
  status = new GrillStatus(Buffer.from(msg));
  // console.log('hex         ', status.hex);
  // console.log('grillOptions', '                ', status.settings);
  // console.log(' ');
  // console.log('grilOptions decode', status.grillOptions);
  if (status.currentGrillTemp !== NaN) {
    // assume valid status
    const dataToStore = { timestamp: new Date().getTime(), ...status };
    await store.add({ timestamp: new Date().getTime(), ...status });
    console.clear();
    console.log(dataToStore);
  }
});

const sendOnce = (message, mode = "ascii") => {
  const data = Buffer.from(message, mode);
  socket.send(data, 0, data.byteLength, PORT, IP, (error) => {});
};

const pollStatus = () => {
  const data = Buffer.from(COMMANDS.getGrillStatus, "ascii");
  socket.send(data, 0, data.byteLength, PORT, IP, (error) => {});
  setTimeout(() => {
    pollStatus();
  }, INTERVAL);
};

// start
pollStatus();

store.setup();

app.get("/", function (req, res) {
  res.send("Hello World!");
});

app.get("/on", function (req, res) {
  sendOnce(COMMANDS.powerOn);
  res.send("On grill!");
});

app.get("/off", function (req, res) {
  sendOnce(COMMANDS.powerOff);
  res.send("Off grill!");
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

app.listen(3000, function () {
  console.log("Example app listening on port 3000!");
});
