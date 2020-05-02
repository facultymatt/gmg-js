import dgram from "dgram";
import { PORT, IP } from "../config";

export const grillSendCommandOnce = async (message, mode = "ascii") => {
  return new Promise((resolve, reject) => {
    const socket = dgram.createSocket("udp4");
    const data = Buffer.from(message, mode);
    // @todo catch error
    // @todo check info for address / port make sure its not originating from us
    // I have not actually seen this happen...
    socket.on("message", (msg, info) => {
      console.log(msg, info);
      socket.close();
      resolve(msg);
    });
    socket.on("error", (msg, info) => {
      console.error(message, msg.toString());
      socket.close();
      reject(msg.toString());
    });
    socket.send(data, 0, data.byteLength, PORT, IP, (err) => {
      if (err) {
        console.error(err);
      }
    });
  });
};
