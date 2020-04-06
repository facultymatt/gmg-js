const dgram = require("dgram");
const express = require("express");
const GrillStatus = require('./GrillStatus')

const app = express();
const socket = dgram.createSocket("udp4");

const IP = "24.11.74.43";
const PORT = 9999;

const commands = Object.freeze({
  powerOn: 'UK001!',
  // powerOff: 'UK004!',
  getGrillStatus: 'UR001!',
  getGrillId: 'UL!',
  // setGrillTempF: (temp) => `UT${temp}!`,
  setFoodTempF: (temp) => `UF${temp}!`
});

// socket.setBroadcast(true);

socket.on("message", (msg, info) => {
  console.log('message', msg, info);
  const buff = Buffer.from(msg);
  // console.log('message', buff.toString());
  const status = new GrillStatus(buff);
  console.log(status);
});

const doSend = (message) => {
  const data = Buffer.from(message, 'ascii')
  socket.send(data, 0, data.byteLength, PORT, IP, (error) => {
    console.error(error);
  });
}

// doSend(commands.getGrillId);
doSend(commands.getGrillStatus);

app.get("/", function (req, res) {
  res.send("Hello World!");
});
app.listen(3000, function () {
  console.log("Example app listening on port 3000!");
});