import eventEmitter from "../services/eventEmitter";
import { addEvent } from "../datastore/pouch";
import { GRILL_EVENTS, EMITTER_EVENTS } from "../constants";

eventEmitter.on(EMITTER_EVENTS.NEW_GRILL_STATUS, (status) => {
  console.log(" ");
  console.log(" ");
  console.log(">>", status);
  console.log(" ");
  console.log(" ");
});

// @todo refactor this to use EMITTER_EVENTS
eventEmitter.on(GRILL_EVENTS.POWER_ON, () => {
  addEvent({
    type: GRILL_EVENTS.POWER_ON,
  });
});

eventEmitter.on(GRILL_EVENTS.POWER_OFF, () => {
  addEvent({
    type: GRILL_EVENTS.POWER_OFF,
  });
});
