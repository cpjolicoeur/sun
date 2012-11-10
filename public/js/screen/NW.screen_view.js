!(function() {
  window.NW       = window.NW || {};

  function init() {
    NW.$('#hold').html(NW.templates.sync_with_desktop());
    NW.createNewGame();
  }

  NW.screen_view = {
    init: init
  };
})();