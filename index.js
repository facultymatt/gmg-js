import { pollStatus } from "./grill-polling";

const app = require("./app.js");

pollStatus();
app.listen(3000, function () {
  console.log("Example app listening on port 3000!");
});
