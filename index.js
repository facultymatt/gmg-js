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
  console.log(status.hex);
  console.log(status.settings);
  console.log(status.test_16_pizza);
  console.log(' ');
  if (status.currentGrillTemp !== NaN) {
    // assume valid status
    await store.add({ timestamp: new Date().getTime(), ...status });
    // console.log("updated status");
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

app.get("/food", function (req, res) {
  sendOnce(COMMANDS.setGrillTempF(150));
  res.send("set food 150");
});

app.listen(3000, function () {
  console.log("Example app listening on port 3000!");
});
