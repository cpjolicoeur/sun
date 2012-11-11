window.NW = window.NW || {};
window.NW.game = window.NW.game || {};
window.NW.game.initShips = function(){

  Crafty.c("Ship",{

    movementSpeed: 8,
    flickerEnd: 0,
    flickerDuration: 120,

    init: function(){
      this.requires("2D, Canvas, Collision, Flicker, ship")
        .attr({ z: 10 })
        .bind("EnterFrame",function(e){
          if(this.flickering){
            if(!this.flickerEnd){
              this.flickerEnd = e.frame + this.flickerDuration;
            }else if(e.frame > this.flickerEnd){
              this.flickerEnd = 0;
              this.flickering = false;
            }
          }
        })
        .bind("Moved",function(from){
          if(this.x + this.w > Crafty.viewport.width ||
              this.x + this.w < this.w ||
              this.y + this.h > Crafty.viewport.height ||
              this.y + this.h < this.h){
            this.attr({ x: from.x, y: from.y });
          }
        })
        .onHit("Bug",function(e){
          e[0].obj.kill("blue")
          this.spawn()
        })
    },
    spawn: function(){
      if(this.flickering !== true){
        this.flickering = true;
        this.attr({
          x: NW.game.spawnPoint.x - this._w / 2,
          y: NW.game.spawnPoint.y - this._h - 20
        });
      }
    }

  });

  Crafty.c("Flicker",{
    flickering: true,
    init:function(){
      this.flicker = true;
      this.bind("EnterFrame",function(frame){
        if(frame.frame % 5 == 0 && this.flickering){
          if(this.alpha == 0.0){
            this.alpha = 1.0;
          }else{
            this.alpha = 0.0;
          }
        }
        if(!this.flickering){
          this.alpha = 1.0;
        }
      });
    }
  });

}
