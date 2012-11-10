var UserController = require("../controller/user");
var GameController = require("../controller/game");
var passport = require("passport");

var ensureAuthenticated = function(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.cookie('return_to', req.url, {
    expires: new Date(Date.now() + 300000)
  });
  return res.redirect("/login");
};

var setRoutes = function(server, models, app, sio) {
  UserController.setModels(models);

  /*
   * ROUTES
   */
  app.get("/", function(req, res) {
    return res.render("index", {
      logged_in: req.isAuthenticated(),
      user: req.user
    });
  });

  /*
   * Socket.io
   */
  sio.sockets.on('connection', function(socket) {
    console.log("new connection", socket.handshake.sessionID);
    // TODO: join this socket to their "game room"
    // socket.join('_ROOM_ID_');
    // socket.broadcast.to('_ROOM_ID_').volatile.emit('foobar');
    // * or *
    // sio.sockets.in('_ROOM_ID_').volatile.emit('foobar');
  });
};

module.exports = {
  set: setRoutes
};
