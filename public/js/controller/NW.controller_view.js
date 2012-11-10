!(function() {
  window.NW = window.NW || {};

  function init() {
    NW.$('#hold').html(NW.templates.enter_token());
    setDomListeners();
  }

  function setDomListeners() {
    NW.$('#sync_with_phone .play').on('click', joinGame);
  }

  function joinGame() {
    var token = NW.$('#game_token').val();
    NW.socket.emit("join_game", {'token': token});
  }

  NW.controller_view = {
    init: init
  };
})();