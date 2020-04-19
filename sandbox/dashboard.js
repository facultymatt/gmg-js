const blessed = require("blessed");
const contrib = require("blessed-contrib");
const screen = blessed.screen();
import { toPairs } from 'lodash';
import { INTERVAL } from "./config";
import * as store from "./datastore";

const table = contrib.table({
  keys: true,
  fg: "white",
  selectedFg: "white",
  selectedBg: "blue",
  interactive: true,
  label: "Real-time readings",
  border: { type: "line", fg: "cyan" },
  columnSpacing: 10, //in chars
  columnWidth: [20, 12] /*in chars*/,
});

//allow control the table with the keyboard
table.focus();

screen.append(table);

const render = async () => {
  const mostRecent = await store.last();
  table.setData({
    headers: ["Metric", "Value"],
    data: toPairs(mostRecent),
  });
  screen.render();
  setInterval(() => {
    render();
  }, INTERVAL);
}

screen.key(["escape", "q", "C-c"], function (ch, key) {
  return process.exit(0);
});

render();
