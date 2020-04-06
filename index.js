const dgram = require("dgram");
const express = require("express");
const GrillStatus = require("./GrillStatus");
const asciichart = require("asciichart");
const csvdb = require("csvdb");
import { PORT, IP, INTERVAL } from "./config";
import { COMMANDS } from "./constants";
import * as store from "./datastore";

const app = express();
const socket = dgram.createSocket("udp4");

const renderChart = async () => {
  const history = await store.all();
  const data = history.map(({ currentProbe1Temp }) => currentProbe1Temp);
  console.log(asciichart.plot(data, { height: 6 }));
  console.log(" ");
};

socket.on("message", async (msg, info) => {
  const status = new GrillStatus(Buffer.from(msg));
  console.log(status);
  await store.add({ timestamp: new Date().getTime(), ...status });
  renderChart();
});

const doSend = (message) => {
  const data = Buffer.from(message, "ascii");
  socket.send(data, 0, data.byteLength, PORT, IP, (error) => {});
  setTimeout(() => {
    doSend(COMMANDS.getGrillStatus);
  }, INTERVAL);
};

// start
doSend(COMMANDS.getGrillStatus);

store.setup();

app.get("/", function (req, res) {
  res.send("Hello World!");
});
app.listen(3000, function () {
  console.log("Example app listening on port 3000!");
});
