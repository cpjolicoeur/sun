!(function() {
  window.NW = window.NW || {};

  window.NW.game = function() {
    Crafty.init(800,600)
    Crafty.canvas.init()
    //automatically play the loading scene
    Crafty.scene("loading");
  }


  //the loading screen that will display while our assets load
  Crafty.scene("loading", function () {
    //load takes an array of assets and a callback when complete

    //black background with some loading text

    //turn the sprite map into usable components
    Crafty.sprite(24, window.NW.generator(), {
        ship: [0, 3]
    },4,0);
    Crafty.sprite(1, "../images/suns.png", {
      sun: [95,0,200,150]
    })

    Crafty.background("#000");
    Crafty.e("2D, Canvas, Text").attr({ w: 100, h: 20, x: 150, y: 120 })
      .text("Loading");
    Crafty.scene("main")

  });

  Crafty.scene("main", function () {

    Crafty.c("bullet0",{

      bulletWidth: 2,
      bulletHeight: 2,
      bulletSpeed: 15,

      init: function(){
        this.requires("Canvas, Color")
          .color('#fff')
          .attr({ w: this.bulletWidth, h: this.bulletHeight });
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
          })
          .onHit("Bullet",function(e){
            this.destroy();
            e[0].obj.destroy();
          })
          .onHit("Bug",function(e){
            this.destroy();
            e[0].obj.destroy();
          });
      }
    });

    Crafty.c("Weapon",{

      fireRate: 5,
      firing: false,

      init: function(){
        this.bind("EnterFrame",function(e){
          if(e.frame % this.fireRate === 0 && this.firing) this.fire();
        });
      },

      fire: function(){
        var weapon = Crafty.e("Bullet, bullet0")
        weapon.attr({
          x: this._x + this._w / 2 - weapon._w / 2,
          y: this._y + this._h / 2 - weapon._h / 2
        });
      }

    });


    Crafty.c("Player",{

      init: function(){
        this.requires("Multiway")
          .multiway(this.movementSpeed,{
            UP_ARROW: -90,
            DOWN_ARROW: 90,
            RIGHT_ARROW: 0,
            LEFT_ARROW: 180
          })
          .bind("KeyDown", function(e) {
            if(e.keyCode === Crafty.keys.SPACE) this.firing = true;
          })
          .bind("KeyUp", function(e) {
            if(e.keyCode === Crafty.keys.SPACE) this.firing = false;
          });
      }

    });


    Crafty.c("Ship",{

      movementSpeed: 5,

      init: function(){
        this.requires("2D, Canvas, Collision, ship")
          .bind("Moved",function(from){
            if(this.x + this.w > Crafty.viewport.width ||
                this.x + this.w < this.w ||
                this.y + this.h > Crafty.viewport.height ||
                this.y + this.h < this.h){
              this.attr({ x: from.x, y: from.y });
            }
          })
      }

    });


// enemy types:
//  bold - flys toward player
//  bitch - flys from player
//  bored - flys randomly

    Crafty.c("bold",{
      dx: 2,
      dy: 1,
      init: function(){
        this.requires("2D")
          .bind("EnterFrame",function(){
            if(this.y > this.target._y + this.target._h){
            }else if(this.x + this.w < this.target._x){
              this.x += this.dx;
            }else if(this.x > this.target._x + this.target._w){
              this.x -= this.dx;
            }
            if(this.y + this.w > Crafty.viewport.height){
              this.destroy();
            }else{
              this.y += this.dy;
            }
          });
      }
    });

    Crafty.c("bitch",{
     dx: 2,
     dy: 1,
     init: function(){
        this.requires("2D")
          .bind("EnterFrame",function(){
            if(this.y > this.target._y + this.target._h){
            }else if(this.x + this.w < this.target._x){
              this.x -= this.dx;
            }else if(this.x > this.target._x + this.target._w){
              this.x += this.dx;
            }
            if(this.y + this.w > Crafty.viewport.height){
              this.destroy();
            }else{
              this.y += this.dy;
            }
          });
     }
    })


// Crafty.c("bored",{
//  movementSpeed: 5,
//  init: function(){
//  }
// })

    Crafty.c("Bug",{
      init: function(){
        this.requires("2D, Canvas, Color")
          .color("rgb(0,0,255)")
          .attr({
            w: 20,
            h: 20
          })
      }
    });

    var sun
    sun = Crafty.e("Sun, 2D, Canvas, Collision, sun")
    sun.attr({
        x: Crafty.viewport.width / 2 - sun._w / 2,
        y: Crafty.viewport.height - sun._h
      });

    var player;
    NW.player = player = Crafty.e("Ship, Weapon, Player")
    player.attr({
        x: Crafty.viewport.width / 2 - player._w / 2,
        y: Crafty.viewport.height - sun._h - player._w - 10
      });

    Crafty.c("Spawner",{
      spawnRate: 50,
      spawnTypes : ["bold","bitch"],
      init: function(){
        this.bind("EnterFrame",function(e){
          var bug;
          var type;
          if(e.frame % this.spawnRate === 0){
            type = this.spawnTypes[Math.floor(Math.random()*2)]
            bug = Crafty.e("Bug, "+type)
            bug.attr({
              x: Crafty.viewport.width / 2 - bug._w / 2,
              y: 0,
              target: player
            });
          }
        })
      }
    })

    Crafty.e("Spawner")

  });
})();
