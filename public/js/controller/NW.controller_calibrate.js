!(function() {
  var doneCB;
  var calibrateData = [];

  window.NW                         = window.NW || {};
  NW.controller_calibrate           = init;
  NW.sendControllerCalibrationData  = receiveData;

  function init(cb) {
    doneCB = cb;
    $('#wrap').html(NW.templates.controller_calibrate());
    setDomListeners();
  }

  function setDomListeners() {
    $('.btn.start', NW.$('#controller_calibrate')).on('click', startCalibration);
  }

  function receiveData(data) {
    calibrateData.push(data.x);
  }

  function startCalibration(e) {
    NW.controllerCalibrationMode = true;
    $(this).hide();
    $('.calibrate', NW.$('#controller_calibrate')).show();
    rotationSteps();
  }

  function doneCalibrating() {
    NW.controllerCalibrationMode = false;
    $('.calibrate', NW.$('#controller_calibrate')).hide();
    doneCB();
  }

  function runCountDown(duration) {
    var initalDuration = duration
    $('#controller_calibrate .countdown').html(duration);
    var countDown = setInterval(function() {
      $('#controller_calibrate .countdown').html(--duration);
      if (duration == initalDuration -1) {
        calibrateData = [];
      }
      if (duration == 1) {
        calculateCalibration();
        clearInterval(countDown);
      }
    }, 1000)
  }

  function calculateCalibration() {
    var total = 0;
    _.each(calibrateData, function(val) {
      total+= val;
    });
    console.log("-- average --");
    console.log(total/calibrateData.length);
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