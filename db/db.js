var db = null;
var db_interface = require('./db_interface');

/*
 * Database Setup
 */
exports.connect = function(cb) {
  if (process.env.NODE_ENV === "production") {
    db = process.env.MONGO_DB;
  }

  db_interface.connect(db, function(models) {
    cb(models);
  });
}