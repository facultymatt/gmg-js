import { BehaviorSubject } from "rxjs";
import GrillStatus from "../models/GrillStatus";

export default new BehaviorSubject(new GrillStatus(""));
