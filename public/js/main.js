!(function() {
  window.NW       = window.NW || {};
  NW.controller   = new Controller({debug: false, changeCallback: controllerOrientChange});
  NW.socket       = io.connect(window.location.origin);
  NW.inGame       = false;


  $(init);

  function init() {
    // chooseSplashScreen();
    // NW.socketListeners();
    // domListeners();
    setupSoundManager();
    NW.$('#hold').html(NW.templates.game_view());
    NW.$('body').append(NW.templates.health_bar_view());
    NW.game.start();
  }

  function setupSoundManager() {
    soundManager.setup({
      url: '/swf/',
      useFlashBlock: false,
      onready: function() {
        window.NW.loadSounds();
      }
    });
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

  function controllerOrientChange(data) {
    if (NW.inGame) {
      data = NW.normalizeInput(data);
      NW.error("sending socket volatile: "+data.x);
      NW.socket.emit("orient_change", {controller: data, ts: new Date().getTime()});
    } else if (NW.controllerCalibrationMode) {
      NW.sendControllerCalibrationData(data);
    }
  }
})();
