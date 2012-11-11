!(function() {
  window.NW = window.NW || {};

  // Deactivating distracting Text Selection:
  // from: http://stackoverflow.com/questions/1794220/how-to-disable-mobilesafari-auto-selection
  $.fn.extend({
    disableSelection : function() {
      this.each(function() {
        this.onselectstart = function() {
          return false;
        };
        this.unselectable = "on";
        $(this).css('-moz-user-select', 'none');
        $(this).css('-webkit-user-select', 'none');
      });
    }
  });

  function init() {
    NW.controller_calibrate(enterTokenForm);
    // enterTokenForm();
  }

  function enterTokenForm() {
    $('#hold').html(NW.templates.enter_token());
    NW.$("#sync_with_phone"); // cache our template selector
    $("#game_token", NW.$("#sync_with_phone")).focus();
    NW.inGame = false;
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
    $(this).disableSelection();
    NW.$('#hold').html(NW.templates.controller_view());
    $(".fire", NW.$("#hold")).on('click', fireWeapon);
    NW.inGame = true;
  }

  function fireWeapon(e) {
    NW.socket.emit("player:fire", {});
  }

  NW.controller_view = {
    init: init
  };
})();
