window.NW = window.NW || {};
window.NW.game = window.NW.game || {};
window.NW.game.initScenes = function(){

  Crafty.scene("loading", function () {

    Crafty.load([
      "../images/suns.png",
      "../images/enemy_1.png",
      "../images/explosion.png"
    ],function(){

      Crafty.sprite(1,window.NW.generator(),{
          ship1: [0, 0, 24, 32],
          ship2: [0, 0, 24, 32]
      },4,0);

      Crafty.sprite(1,"../images/suns.png",{
        sun: [95,0,200,170]
      });

      Crafty.sprite(16,"../images/enemy_1.png",{
        enemy: [0,0]
      });

      Crafty.sprite(16,"../images/explosion.png",{
        explosion: [0,0]
      });

      Crafty.scene("main")

    })

  });

  Crafty.scene("main", function () {

    NW.game.playerAdded({token:"player1"})
    NW.game.playerAdded({token:"player2"})

    Crafty.e("Sun")
    Crafty.e("Spawner")
  })

  Crafty.scene("over",function(){
  })

}