!(function() {
  window.NW = window.NW || {};

  function init() {
    NW.controller_calibrate(enterTokenForm);
  }

  function enterTokenForm() {
    $('#wrap').html(NW.templates.enter_token());
    NW.$("#sync_with_phone"); // cache our template selector
    $("#game_token", NW.$("#sync_with_phone")).focus();
    setDomListeners();
  }

  function setDomListeners() {
    $(".play", NW.$("#sync_with_phone")).on('click', joinGame);
    $(window).on('NK:join_game:success', showController);
  }

  function joinGame() {
    var token = $("#game_token", NW.$("#sync_with_phone")).val();
    NW.socket.emit("join_game", {'token': token});
  }

  function showController(e) {
    NW.$('#hold').html(NW.templates.controller_view());
    $(".fire", NW.$("#hold")).on('click', fireWeapon);
  }

  function fireWeapon(e) {
    NW.socket.emit("player:fire", {});
  }

  NW.controller_view = {
    init: init
  };
})();
