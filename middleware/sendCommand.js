import { isFunction } from "lodash";
import { grillSendCommandOnce } from "../services/grillSendCommandOnce";

export default function (command, mode) {
  return function (req, res, next) {
    if (isFunction(command)) {
      grillSendCommandOnce(command(req, res), mode);
    } else {
      grillSendCommandOnce(command, mode);
    }
    next();
  };
}
