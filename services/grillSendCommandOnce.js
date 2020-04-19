import grillSocket from './grillSocket';
import { PORT, IP } from "../config";

export const grillSendCommandOnce = (message, mode = "ascii") => {
  const data = Buffer.from(message, mode);
  // @todo catch error
  grillSocket.send(data, 0, data.byteLength, PORT, IP, () => {});
};
