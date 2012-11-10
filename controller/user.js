var crypto = require("crypto");
var uuid   = require("node-uuid");
var models = void 0;

var setModels = function(_models) {
  return models = _models;
};

var userExists = function(username, cb) {
  return getUser(username, function(err, users) {
    return cb(err, Boolean(users.length));
  });
};

var getUser = function(username, cb) {
  return models.User.find({
    username: username
  }, function(err, users) { return cb(err, users); });
};

var getUserByToken = function(userToken, cb) {
  return models.User.findOne({
    token: userToken
  }, function(err, user) {
    if (err) { return cb(err, false); }
    else {
      if (user) { return cb(err, user); }
      else { cb('User Not Found', false); }
    }
  });
};

var createUser = function(username, password, email, cb) {
  var user;
  return user = getUser(username, function(err, users) {
    if (!err && users.length) { return cb('Username already exists', false); }
    if (!(username && password)) { return cb('Must provide both username and password', false); }

    var salt = _generateSalt();
    var cryptedPassword = _encrypt(password, salt);
    var u = new models.User();
    u.username  = username;
    u.email     = email;
    u.password  = cryptedPassword;
    u.salt      = salt;
    u.token     = uuid.v1();
    return u.save(function(err) {
      return cb(err, u);
    });
  });
};

var loginUser = function(username, password, cb) {
  return getUser(username, function(err, users) {
    if (!err && users.length) {
      if (_validPassword(users[0], password)) { return cb(err, users[0]); }
      else { return cb('Invalid Password', false); }
    } else {
      if (err) { return cb(err, false); }
      else { return cb("User Not Found", false); }
    }
  });
};

var _generateSalt = function() {
  return crypto.randomBytes(48).toString('hex');
};

var _encrypt = function(password, salt) {
  return crypto.creatHmac('sha1', salt).update(password).digest('hex');
};

var _validPasword = function(user, password) {
  return user.password === _encrypt(password, user.salt);
};

module.exports = {
  getUser: getUser,
  loginUser: loginUser,
  setModels: setModels,
  createUser: createUser,
  userExists: userExists,
  getUserByToken: getUserByToken
};
