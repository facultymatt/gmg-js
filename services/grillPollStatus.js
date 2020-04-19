import { PORT, IP, INTERVAL } from "../config";
import { COMMANDS } from "./constants";
import grillSocket from './grillSocket';

export const grillPollStatus = () => {
  const data = Buffer.from(COMMANDS.getGrillStatus, "ascii");
  grillSocket.send(data, 0, data.byteLength, PORT, IP, (error) => {});
  setTimeout(() => {
    grillPollStatus();
  }, INTERVAL);
};
