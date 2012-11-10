!(function() {
  window.NW       = window.NW || {};

  window.NW.socketListeners = function() {
    NW.socket.on("disconnect", function() {
      NW.inGame = false;
    });

    NW.socket.on("new_game:success", function(data) {
      $(".token", NW.$( '#sync_with_desktop' )).html(data.token);
    });

    NW.socket.on("new_game:error", function(data) {
      console.log("new_game error", data);
      NW.error("problem creating game\n\n"+data.error);
    });

    NW.socket.on("join_game:success", function(data) {
      $(window).trigger("NK:join_game:success");
      NW.inGame = true;
    });

    NW.socket.on("join_game:error", function(data) {
      console.log("join_game error", data);
      NW.error("problem joining game\n\n"+ data.error);
      NW.inGame = false;
    });

    NW.socket.on("orient_change", function(data) {
      var t = new Date().getTime();
      var latency = t - data.ts;
      NW.error("orient_change - latency: "+latency+", x: "+data.controller.x);
      NW.player.trigger("NW:PlayerMoved", data.controller);
    });
  }
})();
