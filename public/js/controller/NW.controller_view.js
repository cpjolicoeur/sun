!(function() {
  window.NW = window.NW || {};

  function init() {
    NW.$('#hold').html(NW.templates.enter_token());
    setDomListeners();
  }

  function setDomListeners() {
    NW.$('#sync_with_phone .play').on('click', joinGame);
    $(window).on('NK:join_game:success', showController);
  }

  function joinGame() {
    var token = NW.$('#game_token').val();
    NW.socket.emit("join_game", {'token': token});
  }

  function showController(e) {
    NW.$('#hold').html(NW.templates.controller_view());
  }

  NW.controller_view = {
    init: init
  };
})();