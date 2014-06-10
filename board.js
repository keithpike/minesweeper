(function(root){
  var Minesweeper = root.Minesweeper = (root.Minesweeper || {});
  
  var Board = Minesweeper.Board = function(height, width){
    this.height = height;
    this.width = width;
    this.tiles = generateBoard(height, width);
    this.generateDisplayBoard();
    this.bombCount = this.generateBombs();
    this.setFlag([11,11]);
    this.setFlag([12,12]);
    this.revealTile([10,10])
  };

  Board.prototype.reset = function(){
    for (var i = 0; i < this.tiles.length; i++){
      var row = this.tiles[i];
      for(var j = 0; j < row.length; j++){
        row[j].revealed = false;
        row[j].bomb = false;
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
      container.addEventListener('mousedown', handleMouseDown);
      container.addEventListener('mouseup', handleMouseUp);
      container.addEventListener('mouseover', handleMouseOver);
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
      if(bombPlacements.indexOf(loc) === -1){
        bombPlacements.push(loc);
      }
    }
    this.setBombs(bombPlacements);
  };
  
  Board.prototype.setBombs = function(placements){
    for(var i = 0; i < placements.length; i++){
      this.tiles[placements[i][0]][placements[i][1]].setBomb();
    }
  };
  
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
  
  Board.prototype.neighborBombCount = function(neighbors){
    var count = 0;
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
  
  
  Board.prototype.revealTile = function(position){
    var tile = this.tiles[position[0]][position[1]];
    if(!tile.flagged && !tile.revealed){
      tile.setRevealed();
      if(tile.isBomb()){
        tile.setMark('activatedBomb');

      } else {
        var neighbors = this.neighbors(position)
        var count = this.neighborBombCount(neighbors)
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

  function handleMouseOver(event){
    if(event.target.className.slice(0, 4) === 'tile'){
      var tile = window.test.board.getTile([event.target.id.split(',')[0], event.target.id.split(',')[1]])  
    } else {
      return false;
    }

    if(window.test.rightMouseDown && window.test.leftMouseDown){ 
      var neighbors = window.test.board.neightbors([event.target.id.split(',')[0], event.target.id.split(',')[1]]);
      for(var count = 0; count < neighbors.length; count++){
        var neighbor = window.test.board.tiles[neighbors[count][0]][neighbors[count][1]]
        if(!neighbor.revealed){
          neighbor.setMark('revealed-0');
        }
      }
    } else if(window.test.leftMouseDown){ 
    
    }
    
//   mouseover
// The element under the pointer is event.target(IE: srcElement).
// The element the mouse came from is event.relatedTarget(IE: fromElement)
  }

  function handleMouseDown(event){
    event.preventDefault();
    fixWhich(event);
    if(event.which === 1){
      window.test.leftMouseDown = true;
    } else if(event.which === 3) {
      window.test.rightMouseDown = true;
    }

    if(event.target.className.slice(0, 4) === 'tile'){    
      var tile = window.test.board.getTile([event.target.id.split(',')[0], event.target.id.split(',')[1]]);
      if(window.test.rightMouseDown === true && window.test.leftMouseDown === false){
        if(!tile.revealed){
          tile.setFlagged();
        }
      }
    }

  }

  function handleMouseUp(event){
    event.preventDefault();
    fixWhich(event);
    if(event.which === 1){
      window.test.leftMouseDown = false;
    } else if(event.which === 3) {
      window.test.rightMouseDown = false;
    }

    if(event.target.className.slice(0, 4) === 'tile'){
      var position = [Math.round(event.target.id.split(',')[0]), Math.round(event.target.id.split(',')[1])]
      var tile = window.test.board.getTile([position[0], position[1]])
      if(event.which === 1 && window.test.rightMouseDown === false && !tile.revealed && !tile.flagged){
        window.test.board.revealTile([position[0], position[1]]);
      } else if(event.which === 1 && window.test.rightMouseDown === true && tile.revealed){
        window.test.board.revealTile([position[0],position[1]]);
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