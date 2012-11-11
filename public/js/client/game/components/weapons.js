window.NW = window.NW || {};
window.NW.game = window.NW.game || {};
window.NW.game.initWeapons = function(){

  Crafty.c("Weapon",{

    fireRate: 5,
    firing: false,

    init: function(){
      this.bind("EnterFrame",function(e){
        if(e.frame % this.fireRate === 0 && this.firing) {
          this.fire();
        }
      });
    },

    fire: function(){
      var weapon = Crafty.e("Bullet, bullet0")
      weapon.attr({
        x: this._x + this._w / 2 - weapon._w / 2,
        y: this._y + this._h / 2 - weapon._h / 2,
      });
    }
  });

  Crafty.c("Bullet", {
    init: function(){
      this.requires("2D, Collision")
        .origin("center")
        .bind("EnterFrame",function(){
          if(this.x > Crafty.viewport.width+this.w ||
              this.x < -this.w ||
              this.y < -this.h ||
              this.y > Crafty.viewport.height+this.h){
            this.destroy();
          }else{
            this.y -= this.bulletSpeed;
          }
      })
      .onHit("Bug",function(e){
        NW.sounds.explode.play()
        this.destroy();
        e[0].obj.kill("blue");
      });
    }
  });

  Crafty.c("bullet0",{

    bulletWidth: 2,
    bulletHeight: 2,
    bulletSpeed: 15,

    init: function(){
      this.requires("2D, Canvas, Color")
        .color('#fff')
        .attr({ w: this.bulletWidth, h: this.bulletHeight });
    }

  });

}