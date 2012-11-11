!(function() {
  window.NW = window.NW || {};
  window.NW.game = window.NW.game || {};

  function findPlayer(token) {
    return _.find(NW.game.players, function(p) {
      return token === p.user;
    });
  }

  NW.game.players = [];

  NW.game.nextPlayer = (function(){
    var cursor = 0;
    return function(){
      if(cursor >= NW.game.players.length) cursor = 0;
      return NW.game.players[cursor++]
    }
  })()

  NW.game.playerAdded = function (data){
    var player = findPlayer(data.token);
    if (!player) {
      var player = {
        user: data.token,
        number: NW.game.players.length + 1
      };
      player.ship = Crafty.e("Ship, Weapon, Player, player" + player.number + ", ship" + player.number);
      player.ship.attr({
        x: NW.game.spawnPoint.x - player.ship._w / 2,
        y: NW.game.spawnPoint.y - player.ship._w - 10
      });
      NW.game.players.push(player);
    } else {
      console.log("player already found", player);
    }
  };

  NW.game.playerMoved = function(data){
    var player = findPlayer(data.token);
    player && player.ship.trigger("NW:Crafty:PlayerMoved", data);
  };

  NW.game.playerStartedFiring = function(data){
    var player = findPlayer(data.token);
    if ('start' == data.rapid) {
      player && (player.ship.firing = true);
    } else {
      player && player.ship.fire();
    }
  };

  NW.game.playerStoppedFiring = function(data) {
    var player = findPlayer(data.token);
    player && (player.ship.firing = false);
  };

  NW.game.playerDisconnected = function(data) {
    // get player from data.token and remove them from the game
    // and the NW.game.players array
    var player = findPlayer(data.token);
    if (player) {
      player.ship.destroy()
      NW.game.players = _.reject(NW.game.players, function(p) { return data.token === p.user });
    }
  };

  NW.game.start = function() {

    NW.setHealth("100%")
    NW.drawSpace();

    Crafty.init(800,600);
    Crafty.canvas.init();

    Crafty.bind("NW:PlayerAdded", NW.game.playerAdded);
    Crafty.bind("NW:PlayerMoved", NW.game.playerMoved);
    Crafty.bind("NW:PlayerStartedFiring", NW.game.playerStartedFiring);
    Crafty.bind("NW:PlayerStoppedFiring", NW.game.playerStoppedFiring);
    Crafty.bind("NW:PlayerDisconnected", NW.game.playerDisconnected);

    NW.game.spawnPoint = {
      x: Crafty.viewport.width / 2,
      y: Crafty.viewport.height - 180
    }

    NW.game.initScenes()
    NW.game.initComponents()

    Crafty.scene("loading");
    console.log("** GAME STARTED **");
  }

  NW.game.stop = function(){
    Crafty.pause();
    $("#game_over").show();
  }

})();
