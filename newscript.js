$('document').ready(function(){
  let ticTacToe = (function(){
    let playerSeed;
    let computerSeed;
    let gameOver = false;
    let currentTurn;
    let _board = [
      '', '', '',
      '', '', '',
      '', '', '',
    ];

    let _generateAvailableMoves = function(){
      let moves = [];
      for (let i = 0; i < 9; i++){
        if(_board[i] === ''){
          moves.push(i);
        }
      }
      return moves;
    }

    let _isTerminalState = function(board){
      // Check rows
      for(let i = 0; i < 9; i += 3){
        if(board[i] != '' && board[i] === board[i+1] && board[i+1] === board[i+2]){
          return 'The winner is ' + board[i];
        }
      }
      //Check columns
      for(let i = 0; i < 3; i++){
        if(board[i] != '' && board[i] === board[i + 3] && board[i + 3] === board[i + 6]){
          console.log(board[i] + ' wins');
          return 'The winner is ' + board[i];
        }
      }
      //Check diagonal
      if(board[0] != '' && board[0] === board[4] && board[4] === board[8]){
        return 'The winner is ' + board[0];
      }
      //Check anti-diagonal
      if(board[2] != '' && board[2] === board[4] && board[4] === board[6]){
        console.log(board[2] + ' wins');
        return 'The winner is ' + board[2];
      }

      for(i = 0; i < 9; i++){
        if(board[i] === ''){
          return;
        }
      }
      return 'It\'s a draw';
    }

    let _evaluateLine = function(field1, field2, field3){
      let score = 0;

      //First field
      if(_board[field1] === computerSeed){
        score = 1;
      } else if (_board[field1] === playerSeed){
        score = -1;
      }

      //Secound cell
      if(_board[field2] === computerSeed){
        if(score === 1) {
          score = 10;
        } else if (score === -1){
          return 0;
        } else {
          score = 1;
        }
      } else if (_board[field2] === playerSeed){
        if(score === -1){
          score = -10;
        } else if(score = 1){
          return 0;
        } else {
          score = -1;
        }
      }

      //Third cell
      if(_board[field3] === computerSeed){
        if (score > 0){
          score *= 10;
        } else if (score < 0){
          return 0;
        } else {
          score = 1;
        }
      } else if (_board[field3] === playerSeed){
        if (score < 0){
          score *= 10;
        } else if (score > 1){
          return 0;
        } else {
          score = -1;
        }
      }
     return score;
    }

    let _evaluate = function(){
      let score = 0;
      score += _evaluateLine(0, 1, 2);
      score += _evaluateLine(3, 4, 5);
      score += _evaluateLine(6, 7, 8);
      score += _evaluateLine(0, 3, 6);
      score += _evaluateLine(1, 4, 7);
      score += _evaluateLine(2, 5, 8);
      score += _evaluateLine(0, 4, 8);
      score += _evaluateLine(2, 4, 6);
      return score;
    }

    let _drawBoard = function(board){
      let fields = $('.board').children();
      for(let i = 0; i < 9; i++){
        $(fields[i]).text(board[i]);
      }
    }

    let setSeeds = function(seed){
      playerSeed = seed === 'X' ? 'X' : 'O';
      computerSeed = playerSeed === 'X' ? 'O' : 'X';
      currentTurn = playerSeed;
      _drawBoard(_board);
    }

    let reset = function(){
      _board = [
      '', '', '',
      '', '', '',
      '', '', '',
    ];

    gameOver = false;
    $('.winner').css('display', 'none');
    _drawBoard(_board);
    }

    let minimax = function(depth, currentSeed){
      let nextMoves = _generateAvailableMoves();

      let bestScore = (computerSeed === currentSeed) ? -10000000 : 10000000;
      let currentScore;
      let bestCoord = -1;

      if(nextMoves.length === 0 || depth === 0){
        bestScore = _evaluate();
      } else {
        nextMoves.forEach(function(move){
          _board[move] = currentSeed;
          if(currentSeed === computerSeed){
            currentScore = minimax(depth - 1, playerSeed)[0];
            if(currentScore > bestScore){
              bestScore = currentScore;
              bestCoord = move;
            }
          } else {
            currentScore = minimax(depth - 1, computerSeed)[0];
            if(currentScore < bestScore) {
              bestScore = currentScore;
              bestCoord = move;
            }
          }
          _board[move] = ''
        });
      }
      return [bestScore, bestCoord];
    }

    let placeSeed = function(coord){
      if(_board[coord] === '' && !gameOver){
        _board[coord] = playerSeed;
        if(_isTerminalState(_board)){
          $('.winner').text(_isTerminalState(_board));
          $('.winner').css('display', 'block');
         gameOver = true;
        }
        if(!gameOver){
        _board[minimax(3, playerSeed)[1]] = computerSeed;
        if(_isTerminalState(_board)){
          $('.winner').text(_isTerminalState(_board));
          $('.winner').css('display', 'block');
          gameOver = true;
        }
        }
        _drawBoard(_board);
      }
    }
    return {
      setSeeds,
      placeSeed,
      reset
    }
  })();

  $('.marker-x').click(function(){
    ticTacToe.setSeeds('X');
    $('.marker-select').css('display', 'none');
    $('.board').css('display', 'flex');
  });
  $('.marker-o').click(function(){
    ticTacToe.setSeeds('O');
    $('.marker-select').css('display', 'none');
    $('.board').css('display', 'flex');
  });
  $('.reset').click(function(){
    ticTacToe.reset();
  });
  $('.board').children().click(function(){
    let coord = $(this).attr('class').match(/\d/g);
    ticTacToe.placeSeed(coord);
  });
});
