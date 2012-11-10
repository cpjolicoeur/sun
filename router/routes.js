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

    // Listen for new game/new token requests
    socket.on("new_game", function(data) {
      GameController.getOpenGame(function(err, game) {
        if (err) {
          socket.emit("new_game:error", {error: err});
        } else {
          GameController.requestToken(function(err, token) {
            if (err) {
              socket.emit("new_game:error", {error: err});
            } else {
              socket.join(game.uuid);
              socket.emit("new_game:success", {token: token});
            }
          });
        }
      });
    });

    // Listen for join game requests
    socket.on("join_game", function(data) {
      GameController.joinGame(data.token, socket.id, function(err, game) {
        if (err) {
          socket.emit("join_game:error", {error: err});
        } else {
          socket.join(game.uuid);
          socket.set("game_uuid", game.uuid, function() {
            // tell everyone in the game that the game has been joined
            sio.sockets.in(game.uuid).emit("join_game:success", {game: game});
          });
        }
      });
    });

    // Listen for controller orientation changes
    socket.on("orient_change", function(data) {
      socket.get("game_uuid", function(err, uuid) {
        socket.broadcast.to(uuid).volatile.emit("orient_change", data);
      });
    });

    // Listen for player weapons fire
    socket.on("player:fire", function(data) {
      socket.get("game_uuid", function(err, uuid) {
        socket.broadcast.to(uuid).volatile.emit("player:fire", data);
      });
    });
  });
};

module.exports = {
  set: setRoutes
};
