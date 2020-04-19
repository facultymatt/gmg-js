import grillSocket from './grillSocket';

grillSocket.on("error", (err) => {
  console.error("error", err);
});