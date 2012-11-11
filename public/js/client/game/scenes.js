window.NW = window.NW || {};
window.NW.game = window.NW.game || {};
window.NW.game.initScenes = function(){

  Crafty.scene("loading", function () {

    Crafty.load([
      "images/ships.png",
      "images/suns.png",
      "images/bugs.png",
      "images/explosions.png",
      "images/sparkles.png"
    ],function(){

      Crafty.sprite(1,"images/ships.png",{
          ship1: [0, 120, 24, 30],
          ship2: [0, 220, 24, 30],
          ship3: [0, 480, 24, 30],
          ship4: [0, 700, 24, 30]
      });

      Crafty.sprite(200,"images/sparkles.png",{
        sun: [0,0]
      });

      Crafty.sprite(16,"images/bugs.png",{
        bug0: [0,0],
        bug1: [0,1],
        bug2: [0,2]
      });

      Crafty.sprite(16,"images/explosions.png",{
        explosion0: [0,0],
        explosion1: [0,1],
        explosion2: [0,2]
      });

      Crafty.scene("main")

    })

  });

  Crafty.scene("main", function () {

    $(window).trigger("NW:GameReady");

    // NW.game.playerAdded({token:"player1"})
    // NW.game.playerAdded({token:"player2"})

    Crafty.e("Sun")
    Crafty.e("Spawner")
  })

  Crafty.scene("over",function(){
  })

}
