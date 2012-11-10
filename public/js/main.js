!(function() {
  window.NW = window.NW || {};
  NW.controller = new Controller();
  NW.socket = io.connect('http://localhost');
  NW.cs = {}; // cached selectors

  $(init);

  function init() {
    chooseSplashScreen();
    socketListeners();
  }

  function chooseSplashScreen() {
    if (NW.controller.supported) {
      $('#hold').append(NW.templates.sync_with_phone());
    } else {
      $('#hold').append(NW.templates.sync_with_desktop());
      NW.cs['d_sync'] = $("#sync_with_desktop");
      createNewGame();
    }
  }

  function createNewGame() {
    console.log("socket", NW.socket);
    NW.socket.emit('new_game');
  }

  function socketListeners() {
    NW.socket.on("new_game:success", function(data) {
      console.log("new_game created", data);
      $(".token", NW.cs['d_sync']).html(data.token);
    });

    NW.socket.on("new_game:error", function(data) {
      console.log("new_game error", data);
    });
  }
})();
