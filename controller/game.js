var uuid = require("node-uuid");
var UserController = require("./user.js");

var models = void 0;

var setModels = function(_models) {
  UserController.setModels(_models);
  return models = _models;
};

var createGame = function(cb) {
  var game = new models.Game();
  game.uuid = uuid.v1();
  game.save(function(err) {
    cb(err, game);
  });
};

/*
 * Find a user by token, otherwise make a new user
 */
var requestToken = function(cb) {
  var _token = uuid.v1().split("-")[0];

  var user = new models.User();
  user.token = _token;
  user.save(function(err) {
    if (err) { return cb(err, false); }
    return cb(err, user.token);
  });
};

var getOpenGame = function(cb) {
  models.Game.findOne({size: {$lt: 4}}, function(err, game) {
    if (err) { return cb(err, false); }
    if (game) { return cb(err, game); }
    else {
      createGame(function(err, game) {
        if (err) { return cb(err, false); }
        else { return cb(err, game); }
      })
    };
  });
};

/*
 * Find the first game with less than 4 players
 * and add the user to that game.  If none, found
 * spawn up a new game.
 */
var joinGame = function(token, sid, cb) {
  getOpenGame(function(err, game) {
    if (err) { return cb(err, false); }

    UserController.getUserByToken(token, function(err, user) {
      if (err) { return cb(err, false); }

      user.sessionId = sid;
      user.save(function(err) {
        if (err) { return cb(err, false); }

        // TODO: only add if this user is not already in the game
        game.users.push(user);
        game.size = game.users.length;
        game.save(function(err) {
          cb(err, game);
        });
      });
    });
  });
};

module.exports = {
  setModels: setModels,
  requestToken: requestToken,
  getOpenGame: getOpenGame,
  joinGame: joinGame
};
