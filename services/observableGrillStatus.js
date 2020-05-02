import { BehaviorSubject } from "rxjs";
import GrillStatus from "../models/GrillStatus";
import { lastKnownStatus } from "../datastore/pouch";

// (async () => {
//   return await lastKnownStatus();
// })();

// console.warn(status);

// @todo model should have a `fromJson` method?
export default new BehaviorSubject("");
