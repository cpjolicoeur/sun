window.NW = window.NW || {};
window.NW.game = window.NW.game || {};
window.NW.game.initSpawner = function(){

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
            target: NW.game.nextPlayer().ship
          });
        }
      })
    }
  });

}