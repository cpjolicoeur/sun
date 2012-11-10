var uuid = require("node-uuid");

var models = void 0;

var setModels = function(_models) {
  return models = _models;
};

var createGame = function(cb) {
  game_id = uuid.v1();

  game = new models.Game();
  game.uuid = game_id;
  game.token = game_id.split("-")[0];
  game.save(function(err) {
    cb(err, game);
  });
};

module.exports = {
  setModels: setModels,
  createGame: createGame
};
