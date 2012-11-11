!(function() {
  window.NW       = window.NW || {};
  window.NW.playersQueued = [];

  function init() {
    NW.$('#hold').html(NW.templates.give_token());
    NW.$('body').prepend(NW.templates.player_connect_view());
    createNewGame();
    setDomListeners();
  }

  function setDomListeners() {
    $(window).on('NK:join_game:success', showGame);

    $(window).on("NW:GameReady", function() {
      addPlayersQueuedToGame();
      NW.inGame = true;
    });
  }

  function addPlayersQueuedToGame() {
    // loop through any queued players and add them to the game
    _.each(NW.playersQueued, function(p, idx) {
      var $elm = $(findPlayerElm(p.token));
      if ($elm) {
        Crafty.trigger("NW:PlayerAdded", p);
        swapTokenForPlayer($elm, $elm.data('playerNum'));
      }
    });
  }

  function findPlayerElm(token) {
    var $avail_tokens = $(".token", NW.$("#player_connect"));
    return _.find($avail_tokens, function(elm) {
      return token === $(elm).find("span").html();
    });
  }

  // find our player number in the available list of tokens
  // If this is the first player, then launch the game
  // otherwise add the new player to the game
  function showGame(evt, data) {
    // only show game_view if this was from our token
    var elm = $(findPlayerElm(data.token));
    if (elm) {
      if (NW.inGame) {
        // add our new player and update tokens UI
        Crafty.trigger("NW:PlayerAdded", data);
        swapTokenForPlayer($elm, $elm.data('playerNum'));
      } else {
        // launch initial game
        NW.$('#hold').html(NW.templates.game_view());
        NW.$('body').append(NW.templates.health_bar_view());
        NW.playersQueued.push(data);
        NW.game.start();
      }
    }
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
