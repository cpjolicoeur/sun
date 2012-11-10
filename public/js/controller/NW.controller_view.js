!(function() {
  window.NW       = window.NW || {};

  function init() {
    NW.$('#hold').html(NW.templates.enter_token());
    NW.enterGameHandler();
  }

  NW.controller_view = {
    init: init
  };
})();