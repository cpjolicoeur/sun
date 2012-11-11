!(function() {
  window.NW                         = window.NW || {};
  NW.controller                     = NW.controller || {};

  NW.controller.normalizeInput = function(data) {
    var normalized = data.x - NW.calibrationLevels[0];
    if (normalized < 0) {
      data.x = data.x/NW.calibrationLevels[45];
    } else {
      data.x = data.x/NW.calibrationLevels[-45];
    }
    return data;
  }
})();