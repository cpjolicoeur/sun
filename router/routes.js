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
  GameController.setModels(models);

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
    sid = socket.handshake.sessionID;
    console.log("new socket connection");

    // Listen for new game/new token requests
    socket.on("new_game", function(data) {
      console.log("new_game", data);
      GameController.createGame(function(err, game) {
        if (err) {
          console.log("error creating game", err);
          socket.emit("new_game:error", {error: err});
        } else {
          console.log("game created", game);
          socket.join(game.uuid);
          socket.set("game_uuid", game.uuid, function() {
            socket.emit("new_game:success", {token: game.token});
          });
        }
      });
    });

    // Listen for join game requests
    socket.on("join_game", function(data) {
      console.log("join_game request", data);
      GameController.joinGame(data.token, socket.id, function(err, game) {
        if (err) {
          console.log("error joining game", err);
          socket.emit("join_game:error", {error: err});
        } else {
          console.log("game joined", game);
          socket.join(game.uuid);
          socket.set("game_uuid", game.uuid, function() {
            socket.emit("join_game:success", {game: game});
          });
        }
      });
    });

    // Listen for controller orientation changes
    socket.on("orient_change", function(data) {
      console.log("orient_change", data);
      socket.get("game_uuid", function(err, uuid) {
        console.log("** broadcast to **", uuid);
        socket.broadcast.to(uuid).volatile.emit("orient_change", data);
      });
    });

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
