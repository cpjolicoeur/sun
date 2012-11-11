window.NW = window.NW || {};
window.NW.game = window.NW.game || {};
window.NW.game.initSpawner = function(){

  Crafty.c("Spawner",{
    _pick: function(from){
      return from[Math.floor(Math.random() * from.length)];
    },
    spawnRateMax: 80,
    spawnBehaviors: [
      "bold",
      "meek"
    ],
    spawnAppearances: [
      "bug0",
      "bug1",
      "bug2"
    ],
    spawnPoints: [
      Crafty.viewport.width / 3,
      Crafty.viewport.width / 3 * 2
    ],
    init: function(){
      this.bind("EnterFrame",function(e){
        var bug;
        var behavior;
        var appearance;
        var point;
        var rate = this.spawnRateMax / NW.game.players.length;
        if(e.frame % rate === 0){
          behavior = this._pick(this.spawnBehaviors);
          appearance = this._pick(this.spawnAppearances);
          point = this._pick(this.spawnPoints);
          bug = Crafty.e("Bug, 2D, Canvas, " + behavior + ", " + appearance);
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