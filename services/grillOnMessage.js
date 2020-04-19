import grillSocket from './grillSocket';

grillSocket.on("message", async (msg, info) => {
  // console.log('message ====');
  // console.log(msg);
  // console.log(Buffer.from(msg).toString());
  // console.log(info);
  // console.log('end message ====');
  // @todo check for non grill status messages
  const grillStatus = new GrillStatus(Buffer.from(msg));
  console.log(grillStatus);
  if (grillStatus.state !== status.state) {
    await store.addEvent({});
  }
  status = {
    timestamp: new Date().getTime(),
    ...grillStatus,
  };
  // console.log('hex         ', status.hex);
  // console.log('grillOptions', '                ', status.settings);
  // console.log(' ');
  // console.log('grilOptions decode', status.grillOptions);
  console.log("status.value", status.value);
  console.log(status.value);
  if (status.value.currentGrillTemp !== NaN) {
    // assume valid status
    await store.add(status);
    // console.clear();
    // console.log(dataToStore);
  }
});
