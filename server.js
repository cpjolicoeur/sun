var express       = require("express");
var database      = require("./db/db_interface");
var passport      = require("passport");
var LocalStrategy = require("passport-local").Strategy;
var app           = express();
var http          = require("http");
var webServer     = http.createServer(app);
var colors        = require("colors");
var io            = require("socket.io");

app.configure(function() {
  app.use(express.static(__dirname+"/public"));
  app.use(express.bodyParser());
  app.use(express.cookieParser(process.env.COOKIE_SECRET || "zip zap foo"));
  app.use(express.session({'cookie':{'maxAge':604800000}, 'secret': process.env.COOKIE_SECRET || "zip zap foo"}));
  app.use(passport.initialize());
  app.use(passport.session());
  app.set("view engine", "jade");
});

/*
 * Passport session setup
 */
passport.serializeUser(function(user, done) {
  done(null, user.username);
});

passport.deserializeUser(function(username, done) {
  UserController.getUser(username, function(err, users) {
    if (!err && users.length) {
      return done(err, users[0]);
    } else {
      return done(err, null);
    }
  });
});

passport.use(new LocalStrategy(function(username, password, done) {
  UserController.loginUser(username, password, function(err, user) {
    if (err) {
      return done(null, false, {'message': err});
    }
    if (!user) {
      return done(null, false, {'message': 'Invalid Login'});
    }
    return done(null, user);
  });
}));

/*
 * Database setup & App Routing
 */
var db = null;
if (process.env.NODE_ENV === "production") {
  db = process.env.MONGO_DB;
}

database.connect(db, function(models) {
  require("./router/routes").set(webServer, models, app);

  var port = process.env.PORT || 9999;
  webServer.listen(port);
  console.log("Started server on port:".green, port);
});
