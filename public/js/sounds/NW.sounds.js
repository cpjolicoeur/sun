!(function() {
  window.NW       = window.NW || {};

  function loadSounds() {
    Crafty.audio.add({
      bug_explode: ['/mp3/boom.mp3'],
      sun_hit: ['/mp3/boom2.mp3']
    });

  }

  window.NW.loadSounds  = loadSounds;
})();