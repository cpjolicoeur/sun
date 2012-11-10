!(function() {
  NW.controller = new Controller();
  $(init);

  function init() {
    chooseSplashScreen();
  }

  function chooseSplashScreen() {
    if (NW.controller.supported) {
      $('#hold').append(NW.templates.sync_with_phone());
    } else {
      $('#hold').append(NW.templates.sync_with_desktop());
    }
  }
})();