const dgram = require("dgram");
const GrillStatus = require("./GrillStatus");
const asciichart = require("asciichart");
import { PORT, IP, INTERVAL } from "./config";
import { COMMANDS } from "./constants";
import * as store from "./datastore-pouch";

const socket = dgram.createSocket("udp4");

let status = new GrillStatus(Buffer.from(''));

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

const latestStatus = () => {
  return status;
};

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

store.setup();

// @todo change to exports
module.exports = {
  pollStatus,
  sendOnce,
  latestStatus
};
