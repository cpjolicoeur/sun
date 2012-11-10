!(function() {
  window.NW       = window.NW || {};

  function init() {
    NW.$('#hold').html(NW.templates.sync_with_phone());
    NW.enterGameHandler();
  }

  NW.controller_view = {
    init: init
  };
})();