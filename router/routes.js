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

var setRoutes = function(server, models, app) {
  UserController.setModels(models);

  app.get("/", function(req, res) {
    return res.render("index", {
      logged_in: req.isAuthenticated(),
      user: req.user
    });
  });
};

module.exports = {
  set: setRoutes
};
