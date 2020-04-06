r = require("rethinkdb");
let connection = null;
r.connect({ host: "localhost", port: 28015 }, function (err, conn) {
  if (err) throw err;
  connection = conn;
  r.db("test")
    .tableCreate("authors")
    .run(connection, function (err, result) {
      if (err) throw err;
      console.log(JSON.stringify(result, null, 2));
    });
});
