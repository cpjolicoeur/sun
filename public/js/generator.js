//This is a comment


(function(){
  window.NW = window.NW || {};
  window.NW.generator = function(){
  var c=document.getElementById("generator");
  var ctx=c.getContext("2d");
  ctx.imageSmoothingEnabled = false;
  ctx.webkitImageSmoothingEnabled = false;
  ctx.mozImageSmoothingEnabled = false;

  var pixel_size = 2;

  var solid_pixels = [
                      [0, 0, 0, 0, 0, 0],
                      [0, 0, 0, 0, 0, 0],
                      [0, 0, 0, 0, 0, 1],
                      [0, 0, 0, 0, 0, 1],
                      [0, 0, 0, 0, 0, 1],
                      [0, 0, 0, 0, 0, 1],
                      [0, 0, 0, 0, 0, 0],
                      [0, 0, 0, 0, 0, 0],
                      [0, 0, 0, 0, 0, 0],
                      [0, 0, 0, 0, 0, 1],
                      [0, 0, 0, 0, 0, 0],
                      [0, 0, 0, 0, 0, 0],
                      ];

  var empty_solid_pixels = [
                            [0, 0, 0, 0, 0, 0],
                            [0, 0, 0, 0, 0, 0],
                            [0, 0, 0, 0, 0, 0],
                            [0, 0, 0, 0, 0, 0],
                            [0, 0, 0, 0, 0, 0],
                            [0, 0, 0, 0, 0, 0],
                            [0, 0, 0, 0, 1, 1],
                            [0, 0, 0, 0, 1, 1],
                            [0, 0, 0, 0, 1, 1],
                            [0, 0, 0, 0, 0, 0],
                            [0, 0, 0, 0, 0, 0],
                            [0, 0, 0, 0, 0, 0]
                            ];

  var empty_avoid_pixels = [
                            [0, 0, 0, 0, 0, 0],
                            [0, 0, 0, 0, 1, 1],
                            [0, 0, 0, 0, 1, 0],
                            [0, 0, 0, 1, 1, 0],
                            [0, 0, 0, 1, 1, 0],
                            [0, 0, 1, 1, 1, 0],
                            [0, 1, 1, 1, 0, 0],
                            [0, 1, 1, 1, 0, 0],
                            [0, 1, 1, 1, 0, 0],
                            [0, 1, 1, 1, 1, 0],
                            [0, 0, 1, 1, 1, 0],
                            [0, 0, 0, 0, 0, 0]
                            ];


  var width = pixel_size*12;
  var height = pixel_size*12;

  function avoid_pixels(rows, cols){
    var toreturn = new Array();
    for (var i=0; i<rows; i++){
      toreturn[i] = new Array();
      for (var j=0; j<cols/2; j++){
        toreturn[i][j] = Math.round(Math.random())*empty_avoid_pixels[i][j];
      }
    }
    return toreturn;
  }

  function cockpit_pixels(rows, cols){
    var toreturn = new Array();
    for (var i=0; i<rows; i++){
      toreturn[i] = new Array();
      for (var j=0; j<cols/2; j++){
        var fill = Math.round(Math.random());
        toreturn[i][j] = (1+1*Math.round(Math.random()))*empty_solid_pixels[i][j];
      }
    }
    return toreturn;
  }

  function filled_pixels(rows, cols){
    var avoid = avoid_pixels(rows, cols);
    var cockpit = cockpit_pixels(rows, cols);
    var toreturn = new Array();
    for (var i=0; i<rows; i++){
      toreturn[i] = new Array();
      for (var j=0; j<cols/2; j++){
        toreturn[i][j] = solid_pixels[i][j] + cockpit[i][j];
        if ( !avoid[i][j] && !cockpit[i][j] ){
          if ( i > 0 && (avoid[i-1][j] || cockpit[i-1][j] == 2)) {
            toreturn[i][j]=1;
          }
          if ( i < (rows- 1) && (avoid[i+1][j] || cockpit[i+1][j] == 2)) {
            toreturn[i][j]=1;
          }
          if ( j > 0 && (avoid[i][j-1] || cockpit[i][j-1] == 2)) {
            toreturn[i][j]=1;
          }
          if ( j < (cols/2 - 1) && (avoid[i][j+1] || cockpit[i][j+1] == 2)) {
            toreturn[i][j]=1;
          }
        } else {
          if (!cockpit[i][j]){
            toreturn[i][j]=2;
          }
        }
      }
    }
    return toreturn;
  }

  function generatePixels(rows,cols,seed){
    Math.seedrandom(seed);
    var filled = filled_pixels(rows, cols);
    var toreturn = new Array();
    for (var i=0; i<rows; i++){
      toreturn[i] = new Array();
      for (var j=0; j<cols; j++){
        var j_mirror = j;
        if (j_mirror > 5){
          j_mirror = 11 - j_mirror;
        }
        toreturn[i][j] = filled[i][j_mirror];
      }
    }
    return toreturn;
  }

  function shipCanvas(color){
    var pseudo_pixels = generatePixels(12, 12, k);
    var ship_canvas = document.createElement('canvas');
    var ship_context = ship_canvas.getContext("2d");
    for (var i=0;i<pseudo_pixels.length;i++){
      for (var j=0;j<pseudo_pixels[i].length;j++){
        if ( pseudo_pixels[i][j] ){
          if ( pseudo_pixels[i][j] == 3 ){
            ship_context.fillStyle  = '97FFFF';
          } else if ( pseudo_pixels[i][j] == 2 ){
            ship_context.fillStyle  = color;
          } else {
            ship_context.fillStyle  = '#000';
          }
          ship_context.fillRect(pixel_size*j, pixel_size*i, pixel_size, pixel_size);
        }
      }
    }
    return ship_canvas;
  }

  function sunCanvas(size){
    var sun_canvas = document.createElement('canvas');
    var sun_context = sun_canvas.getContext("2d");
    for (var i=0; i<size; i++){
      for (var j=0; j<size; j++){
        if ( Math.pow(size/2 - 1,2) > Math.pow((i - (size - 1)/2),2)+Math.pow((j - (size-1)/2),2)){
          if (Math.round(Math.random()) == 1){
            sun_context.fillStyle  = '#ff0';
          } else {
            sun_context.fillStyle  = '#FF8C00';
          }
          sun_context.fillRect(pixel_size*j, pixel_size*i, pixel_size, pixel_size);
        } else if ( Math.pow(size/2,2) > Math.pow((i - (size - 1)/2),2)+Math.pow((j - (size-1)/2),2) ) {
          if (Math.round(Math.random()) == 1){
            sun_context.fillStyle  = '#f00';
          } else {
            sun_context.fillStyle  = '#FF4500';
          }
          sun_context.fillRect(pixel_size*j, pixel_size*i, pixel_size, pixel_size);
        }
      }
    }
    return sun_canvas;
  }

  function Sun(size){
    this.size = size;
    this.canvas = sunCanvas(this.size);

    Sun.prototype.draw = function(x, y, ctx){
      ctx.translate(x,y);
      ctx.drawImage(this.canvas,-this.size/2,-this.size/2);
      ctx.translate(-x,-y);
    }
  }

  function Ship(seed){
    Math.seedrandom(seed);
    this.color = "rgb("+Math.floor(Math.random()*255)+", "+Math.floor(Math.random()*255)+", "+Math.floor(Math.random()*255)+")";
    //console.log(this.color)
    //this.canvas = shipCanvas(this.color);
    this.canvas = shipCanvas("rgb(192,156,249)")

    Ship.prototype.draw = function(x, y, rotation, ctx){
      var ship_context = this.canvas.getContext("2d");
      ctx.translate(x,y);
      ctx.rotate(rotation);
      ctx.drawImage(this.canvas,-width/2,-height/2);
      ctx.rotate(-rotation);
      ctx.translate(-x,-y);
    }
  }

  // var sun1 = new Sun(10)
  // sun1.draw(20, 50, ctx);

  // var sun2 = new Sun(14)
  // sun2.draw(45, 50, ctx);

  // var sun3 = new Sun(100)
  // sun3.draw(145, 50, ctx);

  for (var k=0; k<4; k++){
    var my_ship = new Ship(k);
    for (var s=0; s<13; s++){
      my_ship.draw(12+30*s, 20+25*k, s*Math.PI/8, ctx)
    }
  }

  return c.toDataURL("")

  // img = document.getElementById('example').toDataURL("image/png")
  // document.write('<img src="'+img+'"/>');

}
})()

