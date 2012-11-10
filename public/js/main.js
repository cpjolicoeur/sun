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
    console.log("inside main.js init");
    chooseSplashScreen();
    socketListeners();
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

  function socketListeners() {
    NW.socket.on("disconnect", function() {
      NW.inGame = false;
    });

    NW.socket.on("new_game:success", function(data) {
      console.log("new_game created", data);
      $(".token", NW.$( '#sync_with_desktop' )).html(data.token);
    });

    NW.socket.on("new_game:error", function(data) {
      console.log("new_game error", data);
      NW.error("problem creating game\n\n"+data.error);
    });

    NW.socket.on("join_game:success", function(data) {
      console.log("game joined", data);
      $("body").append("<h3>game joined</h3>");
      NW.inGame = true;
    });

    NW.socket.on("join_game:error", function(data) {
      console.log("join_game error", data);
      NW.error("problem joining game\n\n"+ data.error);
      NW.inGame = false;
    });

    NW.socket.on("orient_change", function(data) {
      NW.error("orient_change - x: "+data.x);
    });
  }
})();
