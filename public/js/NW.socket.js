!(function() {
  window.NW       = window.NW || {};

  window.NW.socketListeners = function() {
    NW.socket.on("disconnect", function() {
      // TODO: put the user token back as available
      Crafty.trigger("NW:PlayerDisconnected", {token: NW.myToken});
      NW.myToken = null;
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

    NW.socket.on("join_game:success", function(data) {
      NW.myToken = data.token;
      $(window).trigger("NK:join_game:success", data);
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
      if (data.rapid == "end") {
        Crafty.trigger("NW:PlayerStoppedFiring", data);
      } else {
        Crafty.trigger("NW:PlayerStartedFiring", data);
      }
    });
  }
})();
