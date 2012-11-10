!(function() {
  window.NW       = window.NW || {};

  function init() {
    NW.$('#hold').html(NW.templates.give_token());
    NW.createNewGame();
  }

  NW.screen_view = {
    init: init
  };
})();