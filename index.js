const dgram = require("dgram");
const express = require("express");
const GrillStatus = require("./GrillStatus");
var asciichart = require("asciichart");
const csv = require("csv");
const csvReader = require("csv-parser");
const fs = require("fs");
const createCsvWriter = require("csv-writer").createObjectCsvWriter;

const FILE = "./data/brisket1.csv";

const csvWriter = createCsvWriter({
  path: FILE,
  header: [
    { id: "timestamp", title: "Timestamp" },
    { id: "state", title: "State" },
    { id: "isOn", title: "ON" },
    { id: "currentGrillTemp", title: "Grill °F" },
    { id: "desiredGrillTemp", title: "Grill °F Target" },
    { id: "currentProbe1Temp", title: "Probe 1 °F" },
    { id: "desiredProbe1Temp", title: "Probe 1 °F Target" },
    { id: "currentProbe2Temp", title: "Probe 1 °F" },
    { id: "desiredProbe2Temp", title: "Probe 2 °F Target" },
    { id: "fanModeActive", title: "Fan Mode" },
    { id: "lowPelletAlarmActive", title: "Low Pellet" },
  ],
});

const history = [];
const csvHistory = [];

const app = express();
const socket = dgram.createSocket("udp4");

const IP = "192.168.86.134";
const PORT = 8080;

const commands = Object.freeze({
  powerOn: "UK001!",
  // powerOff: 'UK004!',
  getGrillStatus: "UR001!",
  getGrillId: "UL!",
  // setGrillTempF: (temp) => `UT${temp}!`,
  setFoodTempF: (temp) => `UF${temp}!`,
});

// socket.setBroadcast(true);

socket.on("message", (msg, info) => {
  console.log("message", msg, info);
  const buff = Buffer.from(msg);
  // console.log('message', buff.toString());
  const status = new GrillStatus(buff);
  history.push(status.currentProbe1Temp);
  renderChart();
  csvWriter
    .writeRecords([{ timestamp: new Date().getTime(), ...status }])
    .then(() => console.log("The CSV file was written successfully"));
});

const renderChart = () => {
  console.log(asciichart.plot(history, { height: 6 }));
};

const doSend = (message) => {
  const data = Buffer.from(message, "ascii");
  socket.send(data, 0, data.byteLength, PORT, IP, (error) => {
    // console.error(error);
  });
  setTimeout(() => {
    doSend(commands.getGrillStatus);
  }, 1000);
};

// doSend(commands.getGrillId);

try {
  if (fs.existsSync(FILE)) {
    console.log("file exists");
    fs.createReadStream(FILE)
      .pipe(csvReader())
      .on("data", (data) => {
        csvHistory.push(data);
        if (data["Probe 2 °F"]) {
          history.push(data["Probe 2 °F"]);
        }
      })
      .on("end", () => {
        console.log("starting recording from GMG");
        doSend(commands.getGrillStatus);
      });
  }
} catch (err) {
  console.log("file does not exists");
  // console.error(err);
  doSend(commands.getGrillStatus);
}

app.get("/", function (req, res) {
  res.send("Hello World!");
});
app.listen(3000, function () {
  console.log("Example app listening on port 3000!");
});
