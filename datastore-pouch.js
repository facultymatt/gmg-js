var PouchDB = require("pouchdb");
const uuid = require("uuid/v4");

const db = new PouchDB("http://localhost:5984/grill");

export async function setup() {}

export async function add(item) {
  return await db
    .put({ _id: `${item.timestamp}`, ...item })
    .then(null, (err) => console.error(err));
}

export async function last() {}

export async function all() {
  return await db
    .allDocs({ include_docs: true, limit: 100, descending: true })
    .then((data) => data.rows.map(({ doc }) => doc).reverse());
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