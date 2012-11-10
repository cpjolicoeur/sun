!(function() {
  window.NW = window.NW || {};
  NW.error = function(message) {
    $('#errors').html(message)
                .show()
                .one('click', function() {
                  $(this).hide();
                });
  }
})();