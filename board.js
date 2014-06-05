(function (root){
  var Minesweeper = root.Minesweeper = (root.Minesweeper || {});
  
  var Board = Minesweeper.Board = function(height, width){
    this.height = height;
    this.width = width;
    this.tiles = generateBoard(height, width);
    this.bombCount = this.generateBombs();
    
  };
  
  function generateBoard(height, width){
    var multiDimensionalArray = new Array(height);
    for (var i = 0; i < multiDimensionalArray.length; i++){
      multiDimensionalArray[i] = new Array(width);
      for(var j = 0; j < multiDimensionalArray[i].length; j++){
        multiDimensionalArray[i][j] = new Minesweeper.Tile();
      }
    }
    return multiDimensionalArray;
  }
  
  Board.prototype.generateBombs = function(){
    var totalBombs = Math.round(this.height * this.width * 0.15);
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
    debugger
    for(var i = 0; i < placements.length; i++){
      
      this.tiles[placements[i][0]][placements[i][1]].setBomb();
    }
  };
  
  function getRand(num){
    return Math.floor(Math.random() * num);
  }
  
})(this);
// 
// class Board
//   attr_reader :bomb_count
//   attr_accessor :tiles
// 
//   def display
//     display_board = []
//     system("clear")
//     print "   "
//     (0...@width).each { |num| print "#{num} " }
//     puts
//     @tiles.each_with_index do |rows, first|
//       print "%02d " % first
//       rows.each_index do |last|
//         print "#{get_symbol([first, last])} "
//       end
//       puts
//     end
//     nil
//   end
// 
//   def get_symbol(pos)
//     # print pos
//     tile = @tiles[pos.first][pos.last]
//     return "F" if tile.flagged
//     if tile.revealed
//       bomb_count = neighbor_bomb_count(pos)
//       return "B" if tile.bombed?
//       if bomb_count == 0
//         "_"
//       else
//         bomb_count.to_s
//       end
//     else
//       # return "B" if tile.bombed?
//       "*"
//     end
//   end
// 
//   def neighbors(pos)
//     first, last = pos
//     neighbors_pos = [[first - 1, last - 1],
//                      [first - 1, last],
//                      [first - 1, last + 1],
//                      [first, last - 1],
//                      [first, last + 1],
//                      [first + 1, last - 1],
//                      [first + 1, last],
//                      [first + 1, last + 1]
//                     ]
//     neighbors_pos.select { |position| on_board?(position) }
//   end
// 
//   def on_board?(pos)
//     (0...@height).cover?(pos.first) && (0...@width).cover?(pos.last)
//   end
// 
//   def neighbor_bomb_count(pos)
//     neighbors(pos).select{ |pos| @tiles[pos.first][pos.last].bombed? }.count
//   end
// 
//   def reveal(pos)
//     tile = @tiles[pos.first][pos.last]
//     tile.set_revealed unless tile.flagged || tile.revealed
//     if tile.revealed && tile.bombed?
//       nil
//     elsif neighbor_bomb_count(pos) == 0
//       neighbors(pos).each do |neighbor|
//         neighboring_tile = @tiles[neighbor.first][neighbor.last]
//         unless neighboring_tile.revealed || neighboring_tile.flagged
//           reveal(neighbor)
//         end
//       end
//       get_symbol(pos)
//     end
//   end
// 
//   def flag(pos)
//     tile = @tiles[pos.first][pos.last]
//     tile.set_flagged unless tile.revealed
//   end
// 
// end