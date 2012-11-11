window.NW = window.NW || {};
window.NW.game = window.NW.game || {};
window.NW.game.initSun = function(){

  Crafty.c("Sun",{
    health: 33,
    init: function(){
      this.requires("2D, Canvas, Collision, SpriteAnimation, sun")
        .attr({
          x: Crafty.viewport.width / 2 - this._w / 2,
          y: Crafty.viewport.height - this._h + 50
        })
        .animate("sparkle",0,0,3)
        .animate("sparkle",120,-1)
        .onHit("Bug",function(e){
          if(this.health > 0){
            this.health--;
            window.NW.setHealth((this.health*3)+"%")
            Crafty.audio.play('sun_hit');
            e[0].obj.kill("red");
          } else {
            NW.game.stop();
          }
        })
    }
  });

}