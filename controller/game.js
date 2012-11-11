var uuid = require("node-uuid");
var UserController = require("./user.js");
var _ = require("lodash");

var models = void 0;

var setModels = function(_models) {
  UserController.setModels(_models);
  return models = _models;
};

var createGame = function(cb) {
  var game = new models.Game();
  game.uuid = uuid.v1();
  game.tokens = [
    Math.floor(Math.random()*1000000).toString(36),
    Math.floor(Math.random()*1000000).toString(36),
    Math.floor(Math.random()*1000000).toString(36),
    Math.floor(Math.random()*1000000).toString(36)
  ],
  game.save(function(err) {
    cb(err, game);
  });
};

/*
 * Generate a new 4 player game
 */
var newGame = function(cb) {
  createGame(function(err, game) {
    if (err) { return cb(err, false); }
    return cb(err, game);
  });
};


/*
 * Find the first game with less than 4 players
 * and add the user to that game.  If none, found
 * spawn up a new game.
 */
var joinGame = function(token, sid, cb) {
  models.Game.findOne({tokens: token}, function(err, game) {
    if (err) { return cb(err, false); }
    if (!game) { return cb('Game Not Found', false); }

    // console.log("games users", game.users);
    var user = _.find(game.users, function(u) {
      return u.token == token;
    });
    // If we already have this user in the game, just return game
    if (user) { return cb(err, game); }

    // If we dont already have a user for this token add them
    var user = new models.User();
    user.socketID = sid;
    user.token = token;
    user.save(function(err) {
      if (err) { return cb(err, false); }

      game.users.push(user)
      game.save(function(err) {
        if (err) { return cb(err, false); }
        return cb(err, game);
      });
    });
  });
};

module.exports = {
  setModels: setModels,
  newGame: newGame,
  joinGame: joinGame
};
