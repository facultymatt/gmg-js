var PouchDB = require("pouchdb");
const uuid = require("uuid/v4");

const db = new PouchDB("http://localhost:5984/api_test_1");
const eventsDb = new PouchDB("http://localhost:5984/events_test_1");

export async function add(item) {
  return await db
    .put({ _id: `${item.timestamp}`, ...item })
    .then(null, (err) => console.error(err));
}

export async function lastKnownStatus() {
  return await db
    .allDocs({ include_docs: true, limit: 1, descending: true })
    .then((data) => data.rows.length ? data.rows[0] : null);
}

export async function all() {
  return await db
    .allDocs({ include_docs: true, limit: 100, descending: true })
    .then((data) => data.rows.map(({ doc }) => doc).reverse());
}

export async function addEvent(item) {
  console.log('addEvent', item);
  const _id = `${item.timestamp || new Date().getTime()}-${item.type}`
  return await eventsDb
    .put({ _id, ...item })
    .then(null, (err) => console.error(err));
}

/**
 * const PouchDB = require("pouchdb");
PouchDB.plugin(require('pouchdb-find'))
const uuid = require("uuid/v4");

const db = new PouchDB("http://localhost:5984/grill");

export async function setup() {}

export async function add(item) {
  return await db
    .put({ _id: uuid(), ...item })
    .then(null, (err) => console.error(err));
}

export async function last() {}

export async function all() {
  return await db
    .find({ limit: 100, sort: ['timestamp']})
    .then((data) => data.rows.map(({ doc }) => doc))
    .catch(err => console.error(err));
}

 */
