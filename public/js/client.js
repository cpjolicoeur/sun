window.onload = function(){

	Crafty.init(400,336)
	Crafty.canvas.init()

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

		var speed = 2
		Crafty.e("Player, 2D, Canvas, Color, Multiway, Collision")
			.color('rgb(0,255,0)')
			.attr({ x: 190, y: 150, w: 20, h: 20 })
			.multiway(speed, {UP_ARROW: -90, DOWN_ARROW: 90, RIGHT_ARROW: 0, LEFT_ARROW: 180})
			.bind('EnterFrame', function () {
				//hit sides
				if (this.y <= 0){ this.y += speed; this.color('rgb(255,0,0)'); }
				if (this.y >= 326){ this.y -= speed; this.color('rgb(255,0,0)'); }
				if (this.x <= 0){ this.x += speed; this.color('rgb(255,0,0)'); }
				if (this.x >= 390){ this.x -= speed; this.color('rgb(255,0,0)'); }
			})
			.onHit("Enemy",function(){
				this.color('rgb(255,0,0)')
			});

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
			.color('#FE0')
			.attr({ x: 125, y: 300, w: 150, h: 40 });

	});


	//automatically play the loading scene
	Crafty.scene("loading");

}