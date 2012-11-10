var uuid = require("node-uuid");

var models = void 0;

var setModels = function(_models) {
  return models = _models;
};

var getGameByToken = function(_token, cb) {
  return models.Game.find({
    token: _token
  }, function(err, games) {
    if (err) { return cb(err, false); }
    else {
      if (games.length) { return cb(err, games[0]); }
      else { cb('Game Not Found', false); }
    }
  });
};

var createGame = function(cb) {
  game_id = uuid.v1();

  var game = new models.Game();
  game.uuid = game_id;
  game.token = game_id.split("-")[0];
  game.save(function(err) {
    cb(err, game);
  });
};

var joinGame = function(token, sid, cb) {
  getGameByToken(token, function(err, game) {
    if (err) { return cb(err, false); }

    var user = new models.User();
    user.sessionId = sid;
    user.save(function(err) {
      if (err) { return cb(err, false); }

      game.users.push(user);
      game.save(function(err) {
        cb(err, game);
      });
    });
  });
};

module.exports = {
  setModels: setModels,
  createGame: createGame,
  joinGame: joinGame
};
