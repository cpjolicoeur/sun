!(function() {
  window.NW       = window.NW || {};

  function init() {
    NW.$('#hold').html(NW.templates.give_token());
    createNewGame();
    setDomListeners();
  }

  function setDomListeners() {
    $(window).on('NK:join_game:success', showGame);
  }

  function showGame(evt, data) {
    // only show game_view if this was from our token
    var my_token = $(".token", NW.$("#hold")).html();
    if (my_token == data.token) {
      NW.$('#hold').html(NW.templates.game_view());
      NW.game(data);
    }
  }

  function createNewGame() {
    NW.socket.emit("new_game");
  }

  NW.screen_view = {
    init: init
  };
})();
