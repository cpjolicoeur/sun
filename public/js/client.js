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

		Crafty.c("LeftControls", {
		    init: function() {
		        this.requires('Multiway');
		    },

		    leftControls: function(speed) {
		        this.multiway(speed, {UP_ARROW: -90, DOWN_ARROW: 90, RIGHT_ARROW: 0, LEFT_ARROW: 180})
		        return this;
		    }

		});

		Crafty.e("2D, DOM, Color, LeftControls, Collision")
			.color('rgb(0,0,255)')
			.attr({ x: 300, y: 150, w: 10, h: 10,
					dX: Crafty.math.randomInt(2, 5),
					dY: Crafty.math.randomInt(2, 5) })
			.leftControls(1)
			// .bind('EnterFrame', function () {
			// 	//hit floor or roof
			// 	if (this.y <= 0 || this.y >= 326) this.dY *= -1;
			// 	if(this.x <= 0 || this.x >= 390) this.dX *= -1;

			// 	this.x += this.dX;
			// 	this.y += this.dY;
			// })


	});


	//automatically play the loading scene
	Crafty.scene("loading");

}