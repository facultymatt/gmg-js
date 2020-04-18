import { HEADERS } from "./constants";
import { FILE } from "./config";
import { last as _last } from "lodash";
const csv = require("async-csv");
const fs = require("fs").promises;
const createCsvWriter = require("csv-writer").createObjectCsvWriter;

let csvWriter;

export async function setup() {
  const allRecords = await all();
  csvWriter = createCsvWriter({
    path: FILE,
    header: HEADERS.map((header) => ({ id: header, title: header })),
  });
  return await csvWriter.writeRecords(allRecords);
}

export async function add(item) {
  return await csvWriter.writeRecords([item]);
}

export async function last() {
  return _last(await all());
}

export async function all() {
  const csvString = await fs.readFile(FILE, "utf-8");
  const rows = await csv.parse(csvString, { columns: true });
  return rows;
}
