!(function() {
  window.NW = window.NW || {};
  NW.controller = new Controller();
  NW.socket = io.connect(window.location.origin);
  NW.cs = {}; // cached selectors

  $(init);

  function init() {
    chooseSplashScreen();
    socketListeners();
  }

  function chooseSplashScreen() {
    var localhost = window.location.origin.match(/localhost/);
    if (NW.controller.supported && localhost) {
      $('#hold').append(NW.templates.sync_with_phone());
      NW.cs['p_sync'] = $("#sync_with_phone");
      enterGameHandler();
    } else {
      $('#hold').append(NW.templates.sync_with_desktop());
      NW.cs['d_sync'] = $("#sync_with_desktop");
      createNewGame();
    }
  }

  function createNewGame() {
    console.log("socket", NW.socket);
    NW.socket.emit("new_game");
  }

  function enterGameHandler() {
    $(".play", NW.cs["p_sync"]).on("click", function(evt) {
      NW.socket.emit("join_game", {token: $("#game_token", NW.cs["p_sync"]).val()});
    });
  }

  function socketListeners() {
    NW.socket.on("new_game:success", function(data) {
      console.log("new_game created", data);
      $(".token", NW.cs["d_sync"]).html(data.token);
    });

    NW.socket.on("new_game:error", function(data) {
      console.log("new_game error", data);
      NW.error("problem creating game\n\n"+data.error);
    });

    NW.socket.on("join_game:success", function(data) {
      console.log("game joined", data);
      $("body").append("<h3>game joined</h3>");
    });

    NW.socket.on("join_game:error", function(data) {
      console.log("join_game error", data);
      NW.error("problem joining game\n\n"+ data.error);
    });
  }
})();
