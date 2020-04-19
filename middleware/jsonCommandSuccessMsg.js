import { isFunction } from "lodash";

export default function (text) {
  return function (req, res) {
    if (isFunction(text)) {
      return res.json({
        message: `Sent grill ${text(req, res)} command`,
      });
    }
    return res.json({
      message: `Sent grill ${text} command`,
    });
  };
}
