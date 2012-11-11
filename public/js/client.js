!(function() {
  window.NW = window.NW || {};

  window.NW.game = function() {
    NW.setHealth("100%")
    Crafty.init(800,600);
    Crafty.canvas.init();
    NW.drawSpace();
    //automatically play the loading scene
    Crafty.scene("loading");
  }


  //the loading screen that will display while our assets load
  Crafty.scene("loading", function () {
    //load takes an array of assets and a callback when complete

    //turn the sprite map into usable components
    Crafty.sprite(1, window.NW.generator(), {
        ship: [0, 0,24,32]
    },4,0);
    Crafty.sprite(1, "../images/suns.png", {
      sun: [95,0,200,170]
    });
    Crafty.sprite(16, "../images/enemy_1.png", {
      enemy: [0,0]
    });
    Crafty.sprite(16, "../images/explosion.png", {
      explosion: [0,0]
    })

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
            NW.sounds.explode.play()
            this.destroy();
            e[0].obj.kill();
          });
      }
    });

    Crafty.c("Weapon",{

      fireRate: 5,
      firing: false,

      init: function(){
        this.bind("EnterFrame",function(e){
          if(e.frame % this.fireRate === 0 && this.firing) {
            NW.sounds.shoot.play()
            this.fire();
          }
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
            if(e.keyCode === Crafty.keys.SPACE) {
              this.firing = true;
            }
          })
          .bind("KeyUp", function(e) {
            if(e.keyCode === Crafty.keys.SPACE) this.firing = false;
          });
      }

    });


    Crafty.c("Ship",{

      movementSpeed: 5,
      flickerStart: 0,
      flickerDuration: 120,

      init: function(){
        this.requires("2D, Canvas, Collision, Flicker, ship")
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
            e[0].obj.kill()
            this.spawn()
          })
      },
      spawn: function(){
        if(this.flickering !== true){
          this.flickering = true;
          this.attr({
            x: Crafty.viewport.width / 2 - this._w / 2,
            y: Crafty.viewport.height - sun._h - this._w - 20
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


// enemy types:
//  bold - flys toward player
//  bitch - flys from player
//  bored - flys randomly **

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
    })

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
    })


// Crafty.c("bored",{
//  movementSpeed: 5,
//  init: function(){
//  }
// })

    // Crafty.c("Bug",{
    //   init: function(){
    //     this.requires("2D, Canvas, Color")
    //       .color("rgb(0,0,255)")
    //       .attr({
    //         w: 20,
    //         h: 20
    //       })
    //   }
    // });

    Crafty.c("Sun",{
      health: 10,
      init: function(){
        this.requires("2D, Canvas, Collision, sun")
          .attr({
            x: Crafty.viewport.width / 2 - this._w / 2,
            y: Crafty.viewport.height - this._h
          })
          .onHit("Bug",function(e){
            if(this.health > 0){
              this.health--;
              window.NW.setHealth((this.health*10)+"%")
              window.NW.sounds["explode2"].play();
              e[0].obj.kill();
            }else{
              Crafty.pause();
              alert('Game Over Bitches');
            }
          })
      }
    })

    var sun = Crafty.e("Sun")

    // var sun
    // sun = Crafty.e("Sun, 2D, Canvas, Collision, sun")
    // sun.attr({
    //     x: Crafty.viewport.width / 2 - sun._w / 2,
    //     y: Crafty.viewport.height - sun._h
    //   })
    // sun.onHit("Bug",function(e){
    //   window.NW.sounds["explode2"].play();
    //   e[0].obj.kill();
    // });

    var player;
    NW.player = player = Crafty.e("Ship, Weapon, Player")
    player.attr({
        x: Crafty.viewport.width / 2 - player._w / 2,
        y: Crafty.viewport.height - sun._h - player._w - 20
      });

    Crafty.c("Spawner",{
      spawnRate: 30,
      spawnTypes: [
        "bold",
        "bitch"
      ],
      spawnPoint: [
        Crafty.viewport.width / 3,
        Crafty.viewport.width / 3 * 2
      ],
      init: function(){
        this.bind("EnterFrame",function(e){
          var bug;
          var type;
          var point;
          if(e.frame % this.spawnRate === 0){
            type = this.spawnTypes[Math.round(Math.random())]
            point = this.spawnPoint[Math.round(Math.random())]
            bug = Crafty.e("Bug, 2D, Canvas, enemy, "+type)
            bug.attr({
              x: point - bug._w / 2,
              y: 0,
              target: player
            });
          }
        })
      }
    });

    Crafty.e("Spawner")

  });
})();
