!(function() {
  var doneCB;

  window.NW   = window.NW || {};
  NW.controller_calibrate = init;

  function init(cb) {
    doneCB = cb;
    $('#wrap').html(NW.templates.controller_calibrate());
    setDomListeners();
  }

  function setDomListeners() {
    $('.btn.start', NW.$('#controller_calibrate')).on('click', startCalibration);
  }

  function startCalibration(e) {
    $(this).hide();
    $('.calibrate', NW.$('#controller_calibrate')).show();
    rotationSteps();
  }

  function doneCalibrating() {
    $('.calibrate', NW.$('#controller_calibrate')).hide();
    doneCB();
  }

  function runCountDown(duration) {
    $('#controller_calibrate .countdown').html(duration);
    var countDown = setInterval(function() {
      $('#controller_calibrate .countdown').html(--duration);
      if (duration == 1) {
        clearInterval(countDown);
      }
    }, 1000)

  }

  function rotationSteps(cb) {
    var steps    = [45, 0 ,-45];
    var duration = 5;
    (function getValue(step) {
      runCountDown(duration);
      $('.to_follow', NW.$('#controller_calibrate')).css('transform', 'rotate('+steps[step]+'deg)');
      setTimeout(function() {
        if (steps[++step] != undefined) {
          getValue(step);
        } else {
          doneCalibrating();
        }
      }, duration * 1000);
    })(0);
  }
})();