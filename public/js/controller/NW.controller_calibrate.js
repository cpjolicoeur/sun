!(function() {
  var doneCB;
  var calibrateData       = [];
  var calibrationDuration = 3;

  window.NW                         = window.NW || {};
  NW.controller_calibrate           = init;
  NW.sendControllerCalibrationData  = receiveData;
  NW.calibrationLevels              = {};

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

  /**
  *
  * shows the seconds by second countdown for calibration
  *
  **/
  function runCountDown(duration, step) {
    var initalDuration = duration
    $('#controller_calibrate .countdown').html(duration);
    var countDown = setInterval(function() {
      $('#controller_calibrate .countdown').html(--duration);
      if (duration == initalDuration -1) {
        calibrateData = [];
      }
      if (duration == 1) {
        calculateCalibration(step);
        clearInterval(countDown);
      }
    }, 1000)
  }

  /**
  *
  * averages the calibration data to calc a "max"
  *
  **/
  function calculateCalibration(step) {
    var total = 0;
    _.each(calibrateData, function(val) {
      total+= val;
    });
    NW.calibrationLevels[step] = total/calibrateData.length;
  }

  /**
  *
  * Steps through each rotation to set calibrations
  *
  **/
  function rotationSteps(cb) {
    var steps    = [45, 0 ,-45];
    var duration = calibrationDuration;
    (function getValue(step) {
      runCountDown(duration, steps[step]);
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