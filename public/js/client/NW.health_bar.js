!(function() {
  window.NW       = window.NW || {};

  NW.setHealth = function(val) {
    NW.$("#health_bar .fill").css('width', val);
  }
})();