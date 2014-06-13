(function(root){
	var Minesweeper = root.Minesweeper = (root.Minesweeper || {});

	var MinesweeperGame = Minesweeper.MinesweeperGame = function(){
		this.board = new Minesweeper.Board(16, 30);
		this.firstMove = true;
		this.leftMouseDown = false;
		this.rightMouseDown = false;
		document.getElementById('resetButton').addEventListener('mousedown', handleResetButtonPress);
		document.getElementById('resetButton').addEventListener('mouseup', handleResetButtonReset);
		document.getElementById('gameContainer').addEventListener('mousedown', handleMouseDown);
	  window.addEventListener('mouseup', handleMouseUp);
	  window.addEventListener('mouseover', handleMouseOver);
	  this.gameOver = false
	};

	MinesweeperGame.prototype.checkGameDone = function(){
		this.gameOver = this.hasLost() || this.hasWon();
		return this.gameOver;
	};

	MinesweeperGame.prototype.hasWon = function(){
		var hiddenTileCount = 0;
		var row = null
		var tile = null
		for(var i = 0; i < this.board.tiles.length; i++){
			row = this.board.tiles[i];
			for(var j = 0; j < row.length; j++){
				tile = row[j];
				if(!tile.revealed){
					hiddenTileCount += 1;
				}	
			}
		}
		if(hiddenTileCount === this.board.bombCount){
    	window.test.displayResults(true);
    	document.getElementById('resetButton').setAttribute('class', "winFace");
			alert("You won! Congratulations!");
			return true;
		}
		return false;
	};

	MinesweeperGame.prototype.hasLost = function(){
		var row = null
		var tile = null
		for(var i = 0; i < this.board.tiles.length; i++){
			row = this.board.tiles[i];
			for(var j = 0; j < row.length; j++){
				tile = row[j];
				if(tile.revealed && tile.isBomb()){
        	window.test.displayResults(false);
        	document.getElementById('resetButton').setAttribute('class', "loseFace");
					return true;
				}
			}
		}
		return false;
	};

	MinesweeperGame.prototype.displayResults = function(win){
		var tile = null;
		var row = null;
		for(var i = 0; i < this.board.tiles.length; i++){
			row = this.board.tiles[i];
			for(var j = 0; j < row.length; j++){
				tile = row[j]
				if(!tile.revealed && !tile.flagged && tile.isBomb()){
					if(win){
						tile.setMark('flagged');
					} else {
						tile.setMark('bomb');
					}
					
				} else if(tile.flagged && !tile.isBomb()){
					tile.setMark('incorrectFlag');
				}
			}
		}
	};


	function handleResetButtonPress(event){
		event.target.setAttribute('class', 'pressedFace');
	}

	function handleResetButtonReset(event){
		event.target.setAttribute('class', 'normalFace');
		window.test.gameOver = false;
		window.test.rightMouseDown = false;
		window.test.firstMove = true;
		window.test.board.reset();
	}

  function handleMouseOver(event){
    if(event.target.className.slice(0, 4) === 'tile'){
      var toTile = window.test.board.getTile([event.target.id.split(',')[0], event.target.id.split(',')[1]]);
    }

    if(event.relatedTarget && event.relatedTarget.className.slice(0, 4) === 'tile'){
	      var fromTile = window.test.board.getTile([event.relatedTarget.id.split(',')[0], event.relatedTarget.id.split(',')[1]])  
		}

    if(window.test.rightMouseDown && window.test.leftMouseDown){
    	if(event.relatedTarget){
		    if(fromTile && !fromTile.revealed && !fromTile.flagged){
		  		fromTile.setMark('concealed');
		  	}
	  	}
      // var neighbors = window.test.board.neighbors([event.target.id.split(',')[0], event.target.id.split(',')[1]]);
      // for(var count = 0; count < neighbors.length; count++){
      //   var neighbor = window.test.board.tiles[neighbors[count][0]][neighbors[count][1]]
      //   if(!neighbor.revealed && !neighbor.flagged){
      //     neighbor.setMark('revealed-0');
      //   }
      // }
    } else if(window.test.leftMouseDown){
    	if(toTile && !toTile.revealed && !toTile.flagged){
	      toTile.setMark('revealed-0');
	  	}

  	if(event.relatedTarget){
	    if(fromTile && !fromTile.revealed && !fromTile.flagged){
	  		fromTile.setMark('concealed');
	  	}
	  }
	  	
    }
    
//   mouseover
// The element under the pointer is event.target(IE: srcElement).
// The element the mouse came from is event.relatedTarget(IE: fromElement)
  }

  function handleMouseDown(event){
    event.preventDefault();
    if(window.test.gameOver === true){
    	return false;
    }
    fixWhich(event);
    if(event.which === 1){
    	document.getElementById('resetButton').setAttribute('class', "dangerFace");
      window.test.leftMouseDown = true;
    } else if(event.which === 3) {
      window.test.rightMouseDown = true;
    }

    if(event.target.className.slice(0, 4) === 'tile'){    
      var tile = window.test.board.getTile([event.target.id.split(',')[0], event.target.id.split(',')[1]]);
      if(window.test.rightMouseDown === true && window.test.leftMouseDown === true){

      } else if(window.test.rightMouseDown === true && window.test.leftMouseDown === false){
        if(!tile.revealed){
          tile.setFlagged();
        }
      } else if(window.test.leftMouseDown === true){
      	if(!tile.revealed && !tile.flagged){
      		tile.setMark('revealed-0');
      	}
      }
    }
  }

  function handleMouseUp(event){
    event.preventDefault();
    if(window.test.gameOver === true){
    	return false;
    }
    fixWhich(event);
    if(event.which === 1){
  		document.getElementById('resetButton').setAttribute('class', "normalFace");
      window.test.leftMouseDown = false;
    } else if(event.which === 3) {
      window.test.rightMouseDown = false;
    }

    if(event.target.className.slice(0, 4) === 'tile'){
      var position = [Math.round(event.target.id.split(',')[0]), Math.round(event.target.id.split(',')[1])]
      var tile = window.test.board.getTile([position[0], position[1]])
      if(window.test.firstMove){
	      while(window.test.board.tiles[position[0]][position[1]].isBomb()){
	      	window.test.board.reset();
	      }	
	      window.test.firstMove = false;
      }
      
      window.test.firstMove = false;
      if(event.which === 1 && window.test.rightMouseDown === false && !tile.revealed && !tile.flagged){
        window.test.board.revealTile([position[0], position[1]]);
				window.test.checkGameDone()
      } else if(((event.which === 1 &&
      					window.test.rightMouseDown === true) ||
      					(event.which === 3 &&
      					window.test.leftMouseDown === true)) &&
      					tile.revealed){
        if(window.test.board.neighborBombCount(position) === window.test.board.neighborFlagCount(position)){
	        window.test.board.revealNeighbors(position);
	        window.test.checkGameDone()
	      }
	    } else if(event.which === 1 && window.test.rightMouseDown === true && !tile.revealed){
	     		tile.setMark('concealed');
      } 
    
    }

    return false;
  }

  // thank you W3C
  function fixWhich(e) {
    if (!e.which && e.button) {
      if (e.button & 1) e.which = 1      // Left
      else if (e.button & 4) e.which = 2 // Middle
      else if (e.button & 2) e.which = 3 // Right
    }
  }


})(this);

