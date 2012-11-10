!(function() {
  window.NW       = window.NW || {};

  NW.$ = function(selector) {
    NW.$[selector] == undefined && (NW.$[selector] = $(selector));
    return NW.$[selector]
  }
})();