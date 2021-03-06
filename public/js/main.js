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
    // NW.$('#hold').html(NW.templates.game_view());
    // NW.$('body').append(NW.templates.health_bar_view());
    // NW.game.start();
  }

  function domListeners() {
    $('#choose_mode .btn.controller , #choose_mode .btn.screen').on('click', function() {
      $('p.description').remove();
    });

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

  function controllerOrientChange(data) {
    if (NW.inGame) {
      NW.socket.emit("orient_change", {controller: data, ts: new Date().getTime()});
    } else if (NW.controllerCalibrationMode) {
      NW.sendControllerCalibrationData(data);
    }
  }
})();
