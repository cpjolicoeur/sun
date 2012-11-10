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

  function showGame() {
    NW.$('#hold').html(NW.templates.game_view());
    NW.game();
  }

  function createNewGame() {
    NW.socket.emit("new_game");
  }

  NW.screen_view = {
    init: init
  };
})();