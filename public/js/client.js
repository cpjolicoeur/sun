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
		Crafty.sprite(28, window.NW.generator(), {
		    ship: [0, 3]
		});
		Crafty.sprite(1, "../images/suns.png", {
			sun: [95,0,200,150]
		})

    Crafty.background("#000");
    Crafty.e("2D, Canvas, Text").attr({ w: 100, h: 20, x: 150, y: 120 })
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
        .color('#fff')
        .attr({ h: 2, w: 2 });
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
			console.log(this._rotation)
			weapon.attr({
				x: this._x + this._w / 2 - weapon._w / 2,
				y: this._y + this._h / 2 - weapon._h / 2,
				rotation: this._rotation + 180,
        dx: 20 * Math.sin((this._rotation+180) / (180 / Math.PI)),
        dy: 20 * Math.cos((this._rotation+180) / (180 / Math.PI))
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
        this.requires("2D, Canvas, Collision, ship")
          .onHit("Enemy",function(){
          },function(){
          })
      }

    })


    NW.player = Crafty.e("Ship, Player, Shooter")
      .attr({ x: 190, y: 150});


    Crafty.e("Enemy, 2D, Canvas, Color, Collision")
      .color('rgb(0,0,255)')
      .attr({ x: 195, y: 20, w: 10, h: 10 })
      .bind('EnterFrame', function(){
        if(this.y < 300) this.y++;
      })
      .onHit("Sun", function(){
        this.color('rgb(255,0,0)')
      });

    sun = Crafty.e("Sun, 2D, Canvas, Collision, sun")
    sun.attr({
      	x: (Crafty.viewport.width / 2 - sun._w / 2),
      	y: (Crafty.viewport.height - sun._h)
      });

  });
})();
