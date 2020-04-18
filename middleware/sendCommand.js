import { isFunction } from "lodash";
import { sendOnce } from "../grill-polling";

export default function (command, mode) {
  return function (req, res, next) {
    if (isFunction(command)) {
      sendOnce(command(req, res), mode);
    } else {
      sendOnce(command, mode);
    }
    next();
  };
}
