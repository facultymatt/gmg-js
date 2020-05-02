import express from 'express';
import requireCode from "../middleware/requireCode";
import sendCommand from "../middleware/sendCommand";
import jsonCommandSuccessMsg from "../middleware/jsonCommandSuccessMsg";
import { COMMANDS } from "../constants";

const router = express.Router();

// power
router.get(
  "/on",
  requireCode,
  sendCommand(COMMANDS.powerOn),
  jsonCommandSuccessMsg("on")
);
router.get(
  "/off",
  requireCode,
  sendCommand(COMMANDS.powerOff),
  jsonCommandSuccessMsg("off")
);
router.get(
  "/cold-smoke",
  requireCode,
  sendCommand(COMMANDS.powerOnColdSmoke),
  jsonCommandSuccessMsg("cold smoke")
);

export default router;
