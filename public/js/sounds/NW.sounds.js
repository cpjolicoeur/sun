!(function() {
  window.NW       = window.NW || {};

  var sounds = {};

  function loadSounds() {
    sounds['shoot'] = soundManager.createSound({
      id: 'shoot',
      url: '/mp3/shoot.mp3'
    });

    sounds['explode'] = soundManager.createSound({
      id: 'explode',
      url: '/mp3/boom.mp3'
    });

    sounds['explode2'] = soundManager.createSound({
      id: 'explode2',
      url: '/mp3/boom2.mp3'
    });
  }

  window.NW.loadSounds  = loadSounds;
  window.NW.sounds      = sounds;
})();