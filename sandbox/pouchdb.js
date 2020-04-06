var PouchDB = require("pouchdb");
const uuid = require('uuid/v4');

var db = new PouchDB('http://localhost:5984/kittens');

db.info().then(function (info) {
  console.log(info);
});

var doc = {
  "_id": uuid(),
  "name": "Mittens",
  "occupation": "kitten",
  "age": 3,
  "hobbies": [
    "playing with balls of yarn",
    "chasing laser pointers",
    "lookin' hella cute"
  ]
};
db.put(doc).then((value) => {
  console.log('success')
}, (err) => {
  console.error(err);
})

// db.get('mittens2').then(function (doc) {
//   console.log('>>>', doc);
// });