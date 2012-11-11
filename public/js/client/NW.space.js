!(function() {
  window.NW = window.NW || {};
  NW.drawSpace = drawSpace;
  var ctx;

  function drawSpace() {
    $('body').append("<canvas id='stars'></canvas>");
    ctx = NW.$('#stars')[0].getContext('2d');
    generateNoise();
    setDomListeners();
  }

  function setDomListeners() {
    $(window).on('resize', generateNoise);
  }

  function generateNoise() {;
    NW.$('#stars')[0].width = $(window).width();
    NW.$('#stars')[0].height = $(window).height();
    ctx.clearRect(0,0, window.innerWidth, window.innerHeight);
    for(var i = 0; i < 1500; ++i) {
      ctx.beginPath()
      ctx.fillStyle = "rgba(255, 255, 255, 0.3)";
      ctx.arc(Math.random() * window.innerWidth, Math.random() * window.innerHeight, 0.3, 2 * Math.PI, false)
      ctx.fill()
    }
  }
})();