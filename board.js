(function(root){
  var Minesweeper = root.Minesweeper = (root.Minesweeper || {});
  
  var Board = Minesweeper.Board = function(height, width){
    this.height = height;
    this.width = width;
    this.tiles = generateBoard(height, width);
    this.generateDisplayBoard();
    this.bombCount = this.generateBombs();
  };

  Board.prototype.countBombs = function(){
    var count = 0;
    for(var i = 0; i < this.tiles.length; i++){
      for(var j = 0; j < this.tiles[i].length; j++){
        if(this.tiles[i][j].isBomb()){
          count += 1;      
        } 
      }
    }
    
    return count;
  }

  Board.prototype.reset = function(){
    for (var i = 0; i < this.tiles.length; i++){
      var row = this.tiles[i];
      for(var j = 0; j < row.length; j++){
        row[j].revealed = false;
        row[j].bomb = false;
        row[j].flagged = false;
        row[j].setMark('concealed');
      }
    }
    this.bombCount = this.generateBombs();
  };
  
  function generateBoard(height, width){
    var multiDimensionalArray = new Array(height);
    for (var i = 0; i < multiDimensionalArray.length; i++){
      multiDimensionalArray[i] = new Array(width);
      for(var j = 0; j < multiDimensionalArray[i].length; j++){
        multiDimensionalArray[i][j] = new Minesweeper.Tile(i, j);
      }
    }
    return multiDimensionalArray;
  }

  Board.prototype.generateDisplayBoard = function(){
    var container = document.getElementById('gameContainer');
      container.oncontextmenu = function(){return false;};
    for (var i = 0; i < this.tiles.length; i++){
      var row = this.tiles[i];
      for(var j = 0; j < row.length; j++){
        container.appendChild(row[j].mark);
      }
      var rowEnd = document.createElement("div");
      rowEnd.setAttribute('class', 'rowEnd');
      container.appendChild(rowEnd);
    }
    true;
  };
  
  Board.prototype.generateBombs = function(){
    var totalBombs = Math.round(this.height * this.width * 0.206);
    var bombPlacements = [];
    while(bombPlacements.length < totalBombs){
      var loc = [getRand(this.height), getRand(this.width)];
      if(!existsWithin(bombPlacements, loc)){
        bombPlacements.push(loc);
      }
    }
    this.setBombs(bombPlacements);
    return totalBombs;
  };
  
  Board.prototype.setBombs = function(placements){
    for(var i = 0; i < placements.length; i++){
      this.tiles[placements[i][0]][placements[i][1]].setBomb();
    }
  };
  
  function existsWithin(existingArr, input){
    for(var i = 0; i < existingArr.length; i++){
      if(existingArr[i][0] === input[0] && existingArr[i][1] === input[1]){
        return true;
      }
    }
    return false;
  }

  function getRand(num){
    return Math.floor(Math.random() * num);
  }
  
  
  Board.prototype.neighbors = function(position){
    var first = position[0];
    var last = position[1];
    var neighborsPos = [
      [first - 1, last - 1],
      [first - 1, last],
      [first - 1, last + 1],
      [first, last - 1],
      [first, last + 1],
      [first + 1, last - 1],
      [first + 1, last],
      [first + 1, last + 1]
    ].select(this.onBoard.bind(this));
    return neighborsPos;
  };
    
  Array.prototype.select = function(check){
    var selectedItems = [];
    for(var i = 0; i < this.length; i++){
      if(check(this[i])){
        selectedItems.push(this[i]);
      }
    }
    return selectedItems;
  };
  
  Board.prototype.onBoard = function(position){
    if(position[0] >= 0 && position[0] < this.height && position[1] >= 0 && position[1] < this.width){
      return true;
    }
    return false;
  };
  
  Board.prototype.neighborBombCount = function(position){
    var count = 0;
    var neighbors = this.neighbors(position);
    for(var i = 0; i < neighbors.length; i++){
      if(this.tiles[neighbors[i][0]][neighbors[i][1]].isBomb()){
        count++;
      }
    }
    return count;
  };
  
  Board.prototype.setFlag = function(position){
    var tile = this.tiles[position[0]][position[1]];
    if(!tile.revealed){
      tile.setFlagged();
      tile.setMark('flagged')
    }
  };

  Board.prototype.neighborFlagCount = function(position){
    var count = 0;
    var neighbors = this.neighbors(position);
    for(var i = 0; i < neighbors.length; i++){
      if(this.tiles[neighbors[i][0]][neighbors[i][1]].flagged){
        count++;
      }
    }
    return count;
  };
  
  Board.prototype.revealNeighbors = function(position){
    var neighbors = this.neighbors(position);
    for(var i = 0; i < neighbors.length; i++){
      this.revealTile(neighbors[i]);
    }
  };
  
  Board.prototype.revealTile = function(position){
    var tile = this.tiles[position[0]][position[1]];
    if(!tile.flagged && !tile.revealed){
      tile.setRevealed();
      if(tile.isBomb()){
        tile.setMark('activatedBomb');

      } else {
        var neighbors = this.neighbors(position)
        var count = this.neighborBombCount(position)
        tile.setMark('revealed-' + count.toString());
        if(count === 0){
          var neighbor = "";
          for(var i = 0; i < neighbors.length; i++){
            neighbor = neighbors[i]
            this.revealTile([neighbor[0], neighbor[1]]);  
          }
        }
      }
    }
  };

  Board.prototype.getTile = function(position){
    return this.tiles[Math.round(position[0])][Math.round(position[1])];
  };

  
})(this);