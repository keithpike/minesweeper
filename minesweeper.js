(function(root){
	var Minesweeper = root.Minesweeper = (root.Minesweeper || {});

	var MinesweeperGame = Minesweeper.MinesweeperGame = function(){
		this.board = new Minesweeper.Board(16, 30);
		this.firstMove = true;
		this.leftMouseDown = false;
		this.rightMouseDown = false;
	};

	MinesweeperGame.prototype.gameDone = function(){
		return this.hasLost() || this.hasWon();
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
					return true;
				}
			}
		}
		return false;
	};

	MinesweeperGame.prototype.displayResults = function(){
		var tile = null;
		var row = null;
		for(var i = 0; i < this.board.tiles.length; i++){
			row = this.board.tiles[i];
			for(var j = 0; j < row.length; j++){
				tile = row[j]
				if(!tile.revealed && !tile.flagged && tile.isBomb()){
					tile.setMark('bomb');
				} else if(tile.flagged && !tile.isBomb()){
					tile.setMark('incorrectFlag');
				}
			}
		}
	};
})(this);

