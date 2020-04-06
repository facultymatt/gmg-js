import { HEADERS } from "./constants";
import { FILE } from "./config";
import Papa from "papaparse";
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
  console.log('allRecords.length', allRecords.length);
  return await csvWriter.writeRecords(allRecords);
}

export async function add(item) {
  return await csvWriter.writeRecords([item]);
}

export async function all() {
  const csvString = await fs.readFile(FILE, "utf-8");
  const rows = await csv.parse(csvString, { columns: true });
  return rows;
}
