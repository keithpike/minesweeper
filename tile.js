( function(root) {
  var Minesweeper = root.Minesweeper = (root.Minesweeper || {});
  
  var Tile = Minesweeper.Tile = function(){
    this.bomb = false;
    this.flagged = false;
    this.revealed = false;
    this.mark = document.createElement('div');
    this.mark.setAttribute('class', 'tile concealed');
  };
  
  Tile.prototype.setBomb = function(){
    this.bomb = !this.bomb;
  };
  
  Tile.prototype.setFlagged = function(){
    this.flagged = !this.flagged;
  };
  
  Tile.prototype.setRevealed = function(){
    this.revealed = true;
  };
  
  Tile.prototype.setMark = function(classString){
    this.mark = "tile " + classString;
  };
  
  Tile.prototype.isBomb = function(){
   this.bomb; 
  };
  
})(this);