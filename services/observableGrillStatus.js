import { BehaviorSubject } from "rxjs";
import GrillStatus from "../models/GrillStatus";
import { filter, distinctUntilChanged } from "rxjs/operators";
import eventEmitter from "./eventEmitter";
import { GRILL_EVENTS } from "../constants";
const status = new BehaviorSubject(new GrillStatus(""));

status
  .pipe(
    filter(({ state }) => state === "on"),
    distinctUntilChanged()
  )
  .subscribe(() => eventEmitter.emit(GRILL_EVENTS.POWER_ON));

status
  .pipe(
    filter(({ state }) => state === "off"),
    distinctUntilChanged()
  )
  .subscribe(() => eventEmitter.emit(GRILL_EVENTS.POWER_OFF));

status
  .pipe(
    filter(({ state }) => state === "fan mode"),
    distinctUntilChanged()
  )
  .subscribe(() => eventEmitter.emit(GRILL_EVENTS.FAN_MODE));

status
  .pipe(
    filter(({ state }) => state === "cold smoke mode"),
    distinctUntilChanged()
  )
  .subscribe(() => eventEmitter.emit(GRILL_EVENTS.POWER_ON_COLDSMOKE));

export default status;
