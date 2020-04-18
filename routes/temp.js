import express from 'express';
import requireCode from "../middleware/requireCode";
import sendCommand from "../middleware/sendCommand";
import jsonCommandSuccessMsg from "../middleware/jsonCommandSuccessMsg";
import { COMMANDS } from "../constants";

const router = express.Router();

router.get(
  "/grill",
  requireCode,
  sendCommand((req) => COMMANDS.setGrillTempF(req.query.temp)),
  jsonCommandSuccessMsg((req) => `grill temp ${req.query.temp}`)
);

router.get(
  "/probe1",
  requireCode,
  sendCommand((req) => COMMANDS.setProbe1TempF(req.query.temp)),
  jsonCommandSuccessMsg((req) => `probe1 temp ${req.query.temp}`)
);

router.get(
  "/probe2",
  requireCode,
  sendCommand((req) => COMMANDS.setProbe2TempF(req.query.temp)),
  jsonCommandSuccessMsg((req) => `probe2 temp ${req.query.temp}`)
);

export default router;
