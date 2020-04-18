import { isFunction } from "lodash";
import { sendOnce } from "../grill-polling";

export default function (command) {
  return function (req, res, next) {
    if (isFunction(command)) {
      sendOnce(command(req, res));
    } else {
      sendOnce(command);
    }
    sendOnce(command);
    next();
  };
}
