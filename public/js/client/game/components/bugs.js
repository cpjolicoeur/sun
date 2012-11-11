window.NW = window.NW || {};
window.NW.game = window.NW.game || {};
window.NW.game.initBugs = function(){

  Crafty.c("Bug",{
    focused: false,
    init: function(){
      this.requires("2D, Canvas")
        .bind("EnterFrame",function(){
          if(this.y > this.target._y + this.target._h ||
              this.y + this.h > Crafty.viewport.height / 2){
            this.focused = true;
            if(this.x + this.w / 2 < Crafty.viewport.width / 2){
              this.x += this.dx;
            }else if(this.x > Crafty.viewport.width / 2 + this.w * 3 / 2){
              this.x -= this.dx;
            }
          }else{
            this.focused = false;
          }
          this.y += this.dy;
        })
    },
    kill: function(){
      var bug = this;
      Crafty.e("2D, DOM, SpriteAnimation, explosion")
        .attr({
          x: bug.x - bug.w / 2,
          y: bug.y - bug.h / 2
        })
        .animate('explode',0,0,4)
        .animate('explode',4,1)
        .bind("AnimationEnd",function(){
          this.destroy()
        })
      this.destroy()
    }
  });

  Crafty.c("bold",{
    dx: 2,
    dy: 1,
    init: function(){
      this.requires("2D, Canvas")
        .bind("EnterFrame",function(){
          if(this.focused){
          }else if(this.x + this.w < this.target._x){
            this.x += this.dx;
          }else if(this.x > this.target._x + this.target._w){
            this.x -= this.dx;
          }
        });
    }
  });

  Crafty.c("bitch",{
   dx: 2,
   dy: 1,
   init: function(){
      this.requires("2D, Canvas")
        .bind("EnterFrame",function(){
          if(this.focused){
          }else if(this.x + this.w <= this.target._x){
            if(this.x > 0){ this.x -= this.dx; };
          }else if(this.x > this.target._x + this.target._w){
            if(this.x + this.w < Crafty.viewport.width){ this.x += this.dx; };
          };
        });
   }
  });

}