window.NW = window.NW || {};
window.NW.game = window.NW.game || {};
window.NW.game.initPlayers = function(){

  Crafty.c("Player",{
    init: function(){
      this.requires("2D, Canvas")
        .bind("NW:Crafty:PlayerMoved", function(data) {
          // x < 0 is right, x > 0 is left
          // z < 0 is forward, z > 0 is backward
          var from = {x: this.x, y: this.y};
          this.x = (data.controller.x < 0) ? (this.x + this.movementSpeed) : (this.x - this.movementSpeed)
          this.y = (data.controller.z > 0) ? (this.y + this.movementSpeed) : (this.y - this.movementSpeed)
          this.trigger("Moved", from);
        })
    }
  });

  Crafty.c("player1",{
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
        })
    }
  });

  Crafty.c("player2",{
    init: function(){
      this.requires("Multiway")
        .multiway(this.movementSpeed,{
          W: -90,
          S: 90,
          D: 0,
          A: 180
        })
        .bind("KeyDown", function(e) {
          if(e.keyCode === Crafty.keys.F) this.firing = true;
        })
        .bind("KeyUp", function(e) {
          if(e.keyCode === Crafty.keys.F) this.firing = false;
        })
    }
  })

  Crafty.c("player3",{
  });

  Crafty.c("player4",{
  });

}