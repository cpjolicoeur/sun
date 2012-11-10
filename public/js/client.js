!(function() {
  window.NW = window.NW || {};

  window.NW.game = function() {
    Crafty.init(400,336)
    Crafty.canvas.init()
    //automatically play the loading scene
    Crafty.scene("loading");
  }


  //the loading screen that will display while our assets load
  Crafty.scene("loading", function () {
    //load takes an array of assets and a callback when complete

    //black background with some loading text
    Crafty.background("#aaa");
    Crafty.e("2D, DOM, Text").attr({ w: 100, h: 20, x: 150, y: 120 })
      .text("Loading");
    Crafty.scene("main")

  });

  Crafty.scene("main", function () {

    // player
    // bullet
    // enemy
    // sun

  Crafty.c("bullet0",{
    init: function(){
      this.requires("2D, Canvas, Color")
        .color('rgb(0,0,0)')
        .attr({ h: 4, w: 4 });
    }
  })

  Crafty.c("Bullet", {
    init: function(){
      this.requires("Collision")
        .bind("EnterFrame",function(){
          if(this.x > Crafty.viewport.width+this.w ||
              this.x < -this.w ||
              this.y < -this.h ||
              this.y > Crafty.viewport.height+this.h){
              this.destroy();
          }
        })
        .onHit("Bullet",function(e){
          this.destroy();
          e[0].obj.destroy();
        })
        .onHit("Enemy",function(e){
          this.destroy();
          e[0].obj.destroy();
        })
    }
  })

  Crafty.c("Weapon",{
    init: function(){
      this.requires("Bullet, bullet0")
        .origin("center")
        .bind("EnterFrame",function(){
          this.x += this.dx;
          this.y += this.dy;
        })
    }
  })

  Crafty.c("Shooter",{

    shooting: false,

    init: function(){
      this.bind("EnterFrame",function(e){
        if(e.frame % 5 === 0 && this.shooting) this.shoot;
      });
    },

    shoot: function(){
      var weapon = Crafty.e("Weapon")
      weapon.attr({
        x: this._x + this._w / 2 - weapon._w / 2,
        y: this._y + this._h / 2 - weapon._h / 2,
        rotation: this._rotation,
        dx: 20 * Math.sin(this._rotation / (180 / Math.PI)),
        dy: 20 * Math.cos(this._rotation / (180 / Math.PI))
      })
    }

  })


    Crafty.c("Player",{

      movementSpeed: 5,

      init: function(){

        this.requires("Multiway")
          .multiway(this.movementSpeed,{
            UP_ARROW: -90,
            DOWN_ARROW: 90,
            RIGHT_ARROW: 0,
            LEFT_ARROW: 180
          })
        .bind("Moved",function(from){
        // keep on screen
          if(this.x + this.w > Crafty.viewport.width ||
              this.x + this.w < this.w ||
              this.y + this.h > Crafty.viewport.height ||
              this.y + this.h < this.h){
            this.attr({ x: from.x, y: from.y });
          }
        })
        .bind("KeyDown", function(e) {
            if(e.keyCode === Crafty.keys.SPACE){
                this.shooting = true;
            }
        })
        .bind("KeyUp", function(e) {
            if(e.keyCode === Crafty.keys.SPACE){
                this.shooting = false;
            }
        })
        .bind("EnterFrame", function(e){
          if(e.frame % 5 == 0 && this.shooting){
            this.shoot()
          }
        })
        .bind("NW:PlayerMoved", function(data) {
          // console.log("NW:PlayerMoved - client", data);
          // x < 0 is right, x > 0 is left
          // z < 0 is forward, z > 0 is backward
          var from = {x: this.x, y: this.y};
          this.x = (data.x < 0) ? (this.x + this.movementSpeed) : (this.x - this.movementSpeed)
          this.y = (data.z > 0) ? (this.y + this.movementSpeed) : (this.y - this.movementSpeed)
          this.trigger("Moved", from);
        });
      }

    })


    Crafty.c("Ship",{

      init: function(){
        this.requires("2D, Canvas, Color, Collision")
          .color("rgb(0,255,0)")
          .onHit("Enemy",function(){
            this.color("rgb(255,0,0)")
          },function(){
            this.color("rgb(0,255,0)")
          })
      }

    })


    NW.player = Crafty.e("Ship, Player, Shooter")
      .attr({ x: 190, y: 150, w: 20, h: 20 })


    Crafty.e("Enemy, 2D, Canvas, Color, Collision")
      .color('rgb(0,0,255)')
      .attr({ x: 195, y: 20, w: 10, h: 10 })
      .bind('EnterFrame', function(){
        if(this.y < 300) this.y++;
      })
      .onHit("Sun", function(){
        this.color('rgb(255,0,0)')
      });

    Crafty.e("Sun, 2D, Canvas, Color, Collision")
      .color('rgb(255,255,0)')
      .attr({ x: 125, y: 300, w: 150, h: 40 });

  });
})();
