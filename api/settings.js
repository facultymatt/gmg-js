import express from "express";
import requireCode from "../middleware/requireCode";
import sendCommand from "../middleware/sendCommand";
import jsonCommandSuccessMsg from "../middleware/jsonCommandSuccessMsg";
import { HEX_COMMANDS } from "../constants";
import observableGrillStatus from "./../services/observableGrillStatus";

const router = express.Router();

router.get(
  "/pizza",
  requireCode,
  sendCommand(
    () => HEX_COMMANDS.setPizzaMode(observableGrillStatus.value.settings),
    "hex"
  ),
  jsonCommandSuccessMsg("pizza mode")
);

router.get(
  "/regular",
  requireCode,
  sendCommand(
    () => HEX_COMMANDS.setRegularMode(observableGrillStatus.value.settings),
    "hex"
  ),
  jsonCommandSuccessMsg("regular mode")
);

export default router;
