!(function() {
  window.NW       = window.NW || {};

  function init() {
    NW.$('#hold').html(NW.templates.give_token());
    NW.$('body').prepend(NW.templates.player_connect_view());
    createNewGame();
    setDomListeners();
    NW.inGame = false;
  }

  function setDomListeners() {
    $(window).on('NK:join_game:success', showGame);
  }

  // find our player number in the available list of tokens
  // If this is the first player, then launch the game
  // otherwise add the new player to the game
  function showGame(evt, data) {
    // only show game_view if this was from our token
    var $avail_tokens = $(".token", NW.$("#player_connect"));
    _.each($avail_tokens, function(elm, idx) {
      var $elm = $(elm);
      if (data.token == $elm.find("span").html()) {
        if (!NW.inGame) {
          // launch initial game
          NW.$('#hold').html(NW.templates.game_view());
          NW.$('body').append(NW.templates.health_bar_view());
          NW.game(data);
          NW.inGame = true;
        }

        // add our new player and update tokens UI
        Crafty.trigger("NW:AddPlayer", data);
        swapTokenForPlayer($elm, idx+1);
      }
    });
  }

  function swapTokenForPlayer($elm, player_num) {
    $elm.data('token', $elm.html());
    $elm.html("Player "+player_num+" connected").addClass("connected");
  }

  function createNewGame() {
    NW.socket.emit("new_game");
  }

  NW.screen_view = {
    init: init
  };
})();
