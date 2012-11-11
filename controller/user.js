var crypto = require("crypto");
var uuid   = require("node-uuid");
var models = void 0;

var setModels = function(_models) {
  return models = _models;
};

var createUser = function(tokne, cb) {
  var user = new models.User();
  user.token = token;
  user.save(function(err) {
    return cb(err, user);
  });
};

module.exports = {
  setModels: setModels,
  createUser: createUser,
};
