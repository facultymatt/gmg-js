import './subscribers/grillStatus';
import { grillPollStatus } from "./services/grillPollStatus";

const app = require("./app.js");

// @TODO start polling here
grillPollStatus();

app.listen(3000, function () {
  console.log("Example app listening on port 3000!");
});
