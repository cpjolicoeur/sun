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
      NW.$('#hold').append(NW.templates.choose_mode());
    } else {
      renderScreen();
    }
  }

  NW.createNewGame = function() {
    NW.socket.emit("new_game");
  }

  NW.enterGameHandler = function() {
    $(".play", NW.$('#sync_with_phone')).on("click", function() {
      var token = NW.$('#game_token').val();
      NW.socket.emit("join_game", {'token': token});
    });
  }

  function controllerOrientChange(data) {
    if (NW.inGame) {
      NW.error("sending socket volatile: "+data.x);
      NW.socket.emit("orient_change", {controller: data, ts: new Date().getTime()});
    }
  }
})();
