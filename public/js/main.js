!(function() {
  window.NW       = window.NW || {};
  NW.controller   = new Controller({debug: false, changeCallback: controllerOrientChange});
  NW.socket       = io.connect(window.location.origin);
  NW.inGame       = false;

  $(init);

  function init() {
    chooseSplashScreen();
    NW.socketListeners();
    domListeners();
  }

  function domListeners() {
    $('#choose_mode .btn.controller').on('click', NW.controller_view.init);
    $('#choose_mode .btn.screen').on('click', NW.screen_view.init);
  }

  function chooseSplashScreen() {
    if (NW.controller.supported) {
      NW.$('#hold').html(NW.templates.choose_mode());
    } else {
      NW.screen_view.init();
    }
  }

  NW.createNewGame = function() {
    NW.socket.emit("new_game");
  }

  function controllerOrientChange(data) {
    if (NW.inGame) {
      NW.error("sending socket volatile: "+data.x);
      NW.socket.emit("orient_change", {controller: data, ts: new Date().getTime()});
    }
  }
})();
