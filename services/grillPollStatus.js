import dgram from "dgram";
import { PORT, IP, INTERVAL } from "../config";
import observableGrillStatus from "../services/observableGrillStatus";
import GrillStatus from "../models/GrillStatus";
import { COMMANDS } from "../constants";
import eventEmitter from "./eventEmitter";
import { grillSendCommandOnce } from "./grillSendCommandOnce";

// export const grillPollStatus = () => {
//   const socket = dgram.createSocket("udp4");
//   const data = Buffer.from(COMMANDS.getGrillStatus, "ascii");

//   socket.on("message", async (msg, info) => {
//     console.log(msg.toString());
//     console.log(info);
//     observableGrillStatus.next(new GrillStatus(Buffer.from(msg)));
//   });

//   socket.on("error", (msg, info) => {
//     console.error("POLL error");
//   });

//   // @TODO catch error
//   const doSendNow = () => {
//     socket.send(data, 0, data.byteLength, PORT, IP, (err) => {});
//   };

//   setInterval(() => {
//     doSendNow();
//   }, INTERVAL);

//   doSendNow();
// };

export const grillPollStatus = async () => {
  const msg = await grillSendCommandOnce(COMMANDS.getGrillStatus, "ascii");
  observableGrillStatus.next(new GrillStatus(Buffer.from(msg)));
  console.log(msg);

  setTimeout(() => {
    grillPollStatus();
  }, INTERVAL);
};
