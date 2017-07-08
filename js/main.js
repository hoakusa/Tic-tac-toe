var app = angular.module('app', []);

app.controller('AppController', function($scope, $timeout, $compile){
  var available = [];
  
  function Ptype() {
    return $scope.game.player.type === true ? "X" : "O";
  }
  
  function Ctype() {
    return $scope.game.computer.type === true ? "X" : "O";
  }
  
  // Draw game board
  var createBoard = function() {
    var boards = '';
    for (var i = 0; i < 9; i++) {
      boards += '<a class="square" id="s' + i + '" ng-click="playerGo(' + i + ')"><span></span></a>';
    }    
    $compile($("#game").html(boards))($scope);
  }

  // RELOAD
  $scope.onLoad = function() {
     
    $scope.isLoad  = true,
    $scope.isStart = false,
    $scope.isPlay  = false;
    $scope.isEnd  = false;
    
    $scope.msg = {};
    available = [];
    
    $scope.game = {
      turn: true, // false:Computer, true:Player
      player: {
        type: true, // 1:X, 0:0
        score: 0,
        history: []
      },
      computer: {
        type: false,
        score: 0,
        history: []
      }
    };
    
    $("#your-turn").css('-webkit-transform', 'translateY(40px)');
    $("#computer-turn").css('-webkit-transform', 'translateY(40px)');
  };
  
  // START A NEW GAME
  $scope.start = function() {
    
    $scope.isLoad  = false;
    $scope.isStart = true;
    $scope.isPlay  = false;
    $scope.isEnd  = false;
  
    $scope.game.turn = true;
    $scope.game.player.history = [];
    $scope.game.computer.history = [];
    
    $("#your-turn").css('-webkit-transform', 'translateY(40px)');
    $("#computer-turn").css('-webkit-transform', 'translateY(40px)');
  };
  
  $scope.select = function(val) {
    $scope.game.turn = val;
    $scope.game.player.type = val;
    $scope.game.computer.type = !val;
    $scope.play();
  }
  
  // START PLAY
  $scope.play = function() {
    $scope.isStart = false;
    $scope.isPlay  = true;

    available = [0,1,2,3,4,5,6,7,8];

    createBoard();
    if($scope.game.turn) {
      // Player go first
      $("#your-turn").animate({'-webkit-transform': 'translateY(0px)'}, 750);
      $("#computer-turn").animate({'-webkit-transform': 'translateY(40px)'}, 750);
    } else {
      // Computer fo first
      $("#your-turn").animate({'-webkit-transform': 'translateY(40px)'}, 750);
      $("#computer-turn").animate({'-webkit-transform': 'translateY(0px)'}, 750);
      computerGo();
    }
  };
  
  // RESTART
  $scope.restart = function() {
    $scope.start();
  };
  
  // PLAYER PLAY
  $scope.playerGo = function(s) {
    // Check availabe
    if (available.indexOf(s) > -1) {      
      // Print type
      var ele = "#s" + s + " span";
      $(ele).text(Ptype());
      $scope.game.player.history.push(s);
      available.splice(available.indexOf(s), 1);
      
      // Check winner
      findWinner(1,available);
      
      // Change turn
      $scope.game.turn = false;
      $("#your-turn").animate({'-webkit-transform': 'translateY(40px)'}, 750);
      $("#computer-turn").animate({'-webkit-transform': 'translateY(0px)'}, 750);
      $timeout(function() {computerGo();}, 1000);
    }        
  };
  
  // COMPUTER  PLAY
  function computerGo() {
    // Check availabe
    if (available.length > 0) {
      
      var s = available[Math.floor(Math.random()*available.length)];
      // Print type
      var ele = "#s" + s + " span";
      $(ele).text(Ctype());
      $scope.game.computer.history.push(s);
      available.splice(available.indexOf(s), 1);
      
      // Check winner
      findWinner(0,available);
      
      // Change turn
      $scope.game.turn = true;
      $("#your-turn").animate({'-webkit-transform': 'translateY(0px)'}, 750);
      $("#computer-turn").animate({'-webkit-transform': 'translateY(40px)'}, 750);
    }        
  };
  
  // FIND WINNER
  function findWinner(who,s) {
    
    if (who && $scope.game.player.history.length >= 3) {
      // Player win
      if (checkWin($scope.game.player.history)) {
        $scope.game.player.score++;
        endGame("You win!");
      } else if (s.length === 0) endGame("Game over");
      
    } else if (!who && $scope.game.computer.history.length >= 3) {
      // Computer win
      if (checkWin($scope.game.computer.history)) {
        $scope.game.computer.score++;
        endGame("You lose!");
      } else if (s.length === 0) endGame("Game over");  
    }
  }
  
  // FINISHED
  function endGame(text) {
    $scope.isEnd   = true;    
    $scope.msg = text;
  }
  
});

function countInArray(array, what) {
    return array.filter(item => item == what).length;
}

function checkWin(history) {
  var d3 = [], p3 = [];

  // 2 diagonal rows
  if (history.indexOf(0) > -1 && history.indexOf(4) > -1 && history.indexOf(8) > -1) {
    return true;
  }

  if (history.indexOf(2) > -1 && history.indexOf(4) > -1 && history.indexOf(6) > -1) {
    return true;
  }
  
  if (history.length === 3) {
    // horizontal row
    if (Math.floor(history[0]/3) === Math.floor(history[1]/3) && Math.floor(history[0]/3) === Math.floor(history[2]/3)) {
      return true;
    }
    
    // verticle row
    if (history[0]%3 === history[1]%3 && history[0]%3 === history[2]%3) {
      return true;
    }
    
  } else {
    var newPlay = history[history.length - 1];
    history.map(function(play) {
      d3.push(Math.floor(play/3));
      p3.push(Math.floor(play%3));
    });
    
    if (countInArray(d3,Math.floor(newPlay/3)) === 3) return true;    
    else if (countInArray(p3,newPlay%3) === 3) return true;
    else return false;
  }
}