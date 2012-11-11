!(function() {
  window.NW       = window.NW || {};

  window.NW.socketListeners = function() {
    NW.socket.on("disconnect", function() {
      // TODO: remove user from game and Crafty display here
    });

    NW.socket.on("new_game:success", function(data) {
      // TODO: display all 4 game tokens here
      _.each(data.game.tokens, function(token, idx) {
        var li = $("<li/>").addClass("token").data('playerNum', idx+1).html("Player "+(idx+1)+": <span>"+token+"</span>");
        $(".tokens", NW.$("#player_connect")).append(li);
      });
    });

    NW.socket.on("new_game:error", function(data) {
      NW.error("problem creating game\n\n"+data.error);
    });

    NW.socket.on("join_game:success", function(game) {
      $(window).trigger("NK:join_game:success", game);
    });

    NW.socket.on("join_game:error", function(data) {
      NW.error("problem joining game\n\n"+ data.error);
    });

    NW.socket.on("orient_change", function(data) {
      var t = new Date().getTime();
      var latency = t - data.ts;
      Crafty.trigger("NW:PlayerMoved", {controller: data.controller, token: data.token});
    });

    NW.socket.on("player:fire", function(data) {
      Crafty.trigger("NW:PlayerStartedFiring", data);
    });
  }
})();
