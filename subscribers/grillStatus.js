import { filter, distinctUntilChanged, skip, pluck, tap } from "rxjs/operators";
import { GRILL_EVENTS } from "../constants";
import { addEvent } from "../datastore/pouch";
import observableGrillStatus from "../services/observableGrillStatus";

observableGrillStatus.pipe(skip(1)).subscribe((status) => {
  // console.log(" ");
  // console.log(" ");
  console.clear();
  console.log(">>", status);
  // console.log(" ");
  // console.log(" ");
});

const stateChanges = observableGrillStatus.pipe(
  pluck("state"),
  distinctUntilChanged(),
  skip(2)
);

export const probe1Changes = (subject) =>
  subject.pipe(
    pluck("desiredProbe1Temp"),
    distinctUntilChanged(),
    skip(2)
  );

const probe2Changes = observableGrillStatus.pipe(
  pluck("desiredProbe2Temp"),
  distinctUntilChanged(),
  skip(2)
);

probe1Changes(observableGrillStatus).subscribe((temp) => {
  addEvent({
    type: GRILL_EVENTS.PROBE_DESIRED_CHANGE,
    probe: 1,
    temp,
  });
});

probe2Changes.subscribe((temp) => {
  addEvent({
    type: GRILL_EVENTS.PROBE_DESIRED_CHANGE,
    probe: 2,
    temp,
  });
});

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
