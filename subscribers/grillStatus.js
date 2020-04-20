import { isEqual } from "lodash";
import {
  filter,
  distinctUntilChanged,
  skip,
  pluck
} from "rxjs/operators";
import { GRILL_EVENTS } from "../constants";
import { addEvent } from "../datastore/pouch";
import observableGrillStatus from "../services/observableGrillStatus";

observableGrillStatus.pipe(skip(1)).subscribe(({ state }) => {
  // console.log(" ");
  // console.log(" ");
  console.log(">>", state);
  // console.log(" ");
  // console.log(" ");
});

const stateChanges = observableGrillStatus.pipe(
  pluck("state"),
  distinctUntilChanged()
);

stateChanges.pipe(filter((state) => state === "on")).subscribe(() => {
  addEvent({
    type: GRILL_EVENTS.POWER_ON,
  });
});

stateChanges.pipe(filter((state) => state === "off")).subscribe(() => {
  addEvent({
    type: GRILL_EVENTS.POWER_OFF,
  });
});

stateChanges.pipe(filter((state) => state === "fan mode")).subscribe(() => {
  addEvent({
    type: GRILL_EVENTS.FAN_MODE,
  });
});

stateChanges
  .pipe(filter((state) => state === "cold smoke mode"))
  .subscribe(() => {
    addEvent({
      type: GRILL_EVENTS.POWER_ON_COLDSMOKE,
      // @todo add percent?
    });
  });
