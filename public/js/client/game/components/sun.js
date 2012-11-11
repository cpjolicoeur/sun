window.NW = window.NW || {};
window.NW.game = window.NW.game || {};
window.NW.game.initSun = function(){

  Crafty.c("Sun",{
    health: 100,
    init: function(){
      this.requires("2D, Canvas, Collision, sun")
        .attr({
          x: Crafty.viewport.width / 2 - this._w / 2,
          y: Crafty.viewport.height - this._h
        })
        .onHit("Bug",function(e) {
          if(this.health > 0){
            this.health--;
            window.NW.setHealth(this.health+"%")
            Crafty.audio.play('sun_hit');
            e[0].obj.kill("red");
          } else {
            NW.game.stop();
          }
        })
    }
  });

}