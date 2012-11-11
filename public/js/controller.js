/**
*
*  via https://github.com/samccone/controller
*
**/
!(function() {
  window.Controller = function(options) {
    options = options || {};
    var settings = {
      debug: options.debug || false,
      changeCallback: options.changeCallback || function(){}
    };

    var lastMotion = {};
    var debugScreen;


    // returns if the current device supports orientation changes and device motion
    function supported() {
      return !!(window.DeviceMotionEvent) || !!(window.DeviceOrientationEvent);
    }

    function onMotionChange(e) {
      lastMotion = normalizeAcceleration(e.accelerationIncludingGravity);
      settings.debug && outputDebug();
      settings.changeCallback && settings.changeCallback(lastMotion);
    }

    function onOrientationChange(e) {
      lastMotion = normalizeOrientationChange(e);
      settings.debug && outputDebug();
      settings.changeCallback && settings.changeCallback(lastMotion);
    }

    function normalizeOrientationChange(e) {
      if (e.alpha) {
        if (window.orientation == 90) {
          return {x: -1 * e.beta, z: e.gamma, orientation: window.orientation}
        } else if (window.orientation == 0) {
          return {x: -1 * e.gamma, z: e.beta, orientation: window.orientation}
        } else {
          return {x: e.beta, z: e.gamma, orientation: window.orientation}
        }
      } else {
        return {x: -1 * e.gamma, z: e.beta, orientation: 0}
      }
    }

    function outputDebug() {
      if (debugScreen) {
        debugScreen.innerHTML = stringifyObject(lastMotion);
      } else {
        debugScreen = document.createElement("pre");
        document.body.appendChild(debugScreen);
        outputDebug();
      }
    }

    function stringifyObject(obj) {
      var toReturn = "";
      for(var i = 0; i < Object.keys(obj).length; ++i) {
        var key = Object.keys(obj)[i];
        toReturn +=  key + ": " + obj[key] + "</br>";
      }
      return toReturn;
    }

    // inverts the Z axis
    // uses Y for X and flips it and inverts it depending on the orientation
    // so it maps to left and right
    // -- this is basically emulating a steering wheel --
    function normalizeAcceleration(acceleration) {
      var flipAcceleration = (window.orientation == 90 || window.orientation == 180) ? 1 : -1;
      var xDirection = (window.orientation == 0 || window.orientation == 180) ? acceleration.x : acceleration.y;
      return {
        x: xDirection,
        z: acceleration.z * -1,
        orientation: window.orientation
      }
    }

    (function init() {
      if (supported) {
        if (!!(window.DeviceMotionEvent)) {
          window.addEventListener("devicemotion", onMotionChange);
        } else if (!!(window.DeviceOrientationEvent)) {
          window.addEventListener("deviceorientation", onOrientationChange);
        }
      }
    }())

    return {
      'supported': supported()
    }
  };
})();