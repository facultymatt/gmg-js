import { sendOnce } from "../grill-polling";

export default function (command, text) {
  return function (req, res) {
    sendOnce(command);
    return res.json({
      message: `Sent grill ${text} command`,
    });
  };
}
