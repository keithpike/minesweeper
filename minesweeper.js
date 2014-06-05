// class MineSweeper
// 
//   def initialize
//     @board = Board.new
//   end
// 
//   def play
//     until done?
//       @board.display
//       move, pos = get_user_input
//       update_space(move, pos)
//     end
//     display_results(win?)
//   end
// 
//   def display_results(winner)
//     end_message = "You're a WINNER!"
//     unless winner
//       end_message = "You're a LOSER!"
//       @board.tiles.each do |rows|
//         rows.each { |tile| tile.set_revealed if tile.bombed?}
//       end
//     end
//     @board.display
//     puts end_message
//   end
// 
//   def win?
//     hidden_tile_count = 0
//     @board.tiles.each do |rows|
//       rows.each do |tile|
//         hidden_tile_count += 1 unless tile.revealed
//       end
//     end
//     hidden_tile_count == @board.bomb_count
//   end
// 
//   def lose?
//     @board.tiles.each do |rows|
//       rows.each do |tile|
//         return true if tile.bombed? and tile.revealed
//       end
//     end
//     false
//   end
// 
//   def done?
//     win? || lose?
//   end
// 
//   def get_user_input
//     puts "Enter your move (R for reveal, F for flag) and the coordinates"
//     puts "For example: 'R 3,2'"
//     parse_user_input(gets.chomp)
//   end
// 
//   def parse_user_input(input)
//     input_array = input.split(" ")
//     move = input_array.first.upcase
//     coords = input_array.last.split(",").map(&:to_i)
//     [move, coords]
//   end
// 
//   def update_space(move, pos)
//     @board.flag(pos) if move == "F"
//     @board.reveal(pos) if move == "R"
//   end
// end
// 
// 
// if __FILE__ == $PROGRAM_NAME
//   game = MineSweeper.new
//   game.play
// end