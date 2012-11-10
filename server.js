var express       = require("express");
var database      = require("./db/db_interface");
var app           = express();
var http          = require("http");
var webServer     = http.createServer(app);
var colors        = require("colors");
var sio           = require("socket.io").listen(webServer, {log: false});

app.configure(function() {
  app.use(express.static(__dirname+"/public"));
  app.use(express.bodyParser());
  app.use(express.cookieParser(process.env.COOKIE_SECRET || "zip zap foo"));
  app.use(express.session({'cookie':{'maxAge':604800000}, 'secret': process.env.COOKIE_SECRET || "zip zap foo"}));
  app.set("view engine", "jade");
});

/*
 * Database setup & App Routing
 */
var db = null;
if (process.env.NODE_ENV === "production") {
  db = process.env.MONGO_DB;
}

database.connect(db, function(models) {
  require("./router/routes").set(webServer, models, app, sio);

  var port = process.env.PORT || 9999;
  webServer.listen(port);
  console.log("Started server on port:".green, port);
});
