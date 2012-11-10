!(function() {
  window.NW       = window.NW || {};

  window.NW.socketListeners = function() {
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