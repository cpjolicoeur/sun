!(function() {
  window.NW       = window.NW || {};
  NW.controller   = new Controller({debug: true, changeCallback: controllerOrientChange});
  NW.socket       = io.connect(window.location.origin);
  NW.inGame       = false;

  NW.$ = function(selector) {
    NW.$[selector] == undefined && (NW.$[selector] = $(selector));
    return NW.$[selector]
  }

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
    console.log("socket", NW.socket);
    NW.socket.emit("new_game");
  }

  NW.enterGameHandler = function() {
    $(".play", NW.$('#sync_with_phone')).on("click", function(evt) {
      NW.socket.emit("join_game", {token: $("#game_token", NW.$['#sync_with_phone']).val()});
    });
  }

  // NW.controllerOrientChange = function(data) {
  function controllerOrientChange(data) {
    // console.log("orientChange", data);
    // NW.error("x: "+data.x);
    if (NW.inGame) {
      NW.error("sending socket volatile: "+data.x);
      // NW.socket.volatile.emit('orient_change', {data: data});
      NW.socket.emit("orient_change", data);
    }
  }
})();
