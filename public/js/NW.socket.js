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
      NW.error("problem creating game\n\n"+data.error);
    });

    NW.socket.on("join_game:success", function(game) {
      $(window).trigger("NK:join_game:success", game);
      NW.inGame = true;
    });

    NW.socket.on("join_game:error", function(data) {
      NW.error("problem joining game\n\n"+ data.error);
      NW.inGame = false;
    });

    NW.socket.on("orient_change", function(data) {
      var t = new Date().getTime();
      var latency = t - data.ts;
      NW.error("orient_change - latency: "+latency+", x: "+data.controller.x);
      Crafty.trigger("NW:PlayerMoved", {controller: data.controller, token: data.token});
    });

    NW.socket.on("player:fire", function(data) {
      Crafty.trigger("NW:PlayerShoot", data.token);
    });
  }
})();
