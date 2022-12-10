import gleam/erlang/file
import gleam/io
import gleam/list
import gleam/string
import gleam/int
import gleam/result

pub type Grid =
  List(List(Int))

// (x, y)
pub type Coordinate =
  #(Int, Int)

pub fn get_tree_height(grid: Grid, coordinate: Coordinate) -> Int {
  let x = coordinate.0
  let y = coordinate.1
  assert Ok(row) = list.at(grid, y)
  assert Ok(item) = list.at(row, x)
  item
}

pub fn is_edge(grid: Grid, coordinate: Coordinate) -> Bool {
  let grid_length = list.length(of: grid) - 1

  case coordinate {
    // left
    #(_, y) if y == 0 -> True
    // right
    #(_, y) if y == grid_length -> True
    // top
    #(x, _) if x == 0 -> True
    // bottom
    #(x, _) if x == grid_length -> True
    // must be in the middle
    _ -> False
  }
}

pub fn get_tree_scenic_score(grid: Grid, coordinate: Coordinate) -> Int {
  let height = get_tree_height(grid, coordinate)
  let x = coordinate.0
  let y = coordinate.1

  assert Ok(row_values) = list.at(grid, y)

  let col_values =
    list.map(
      grid,
      fn(row) {
        assert Ok(col_val) = list.at(row, x)
        col_val
      },
    )

  let trees_north =
    list.range(0, y - 1)
    |> list.map(fn(ind) {
      assert Ok(val) = list.at(col_values, ind)
      val
    })

  let trees_east =
    list.range(x + 1, list.length(row_values) - 1)
    |> list.map(fn(ind) {
      assert Ok(val) = list.at(row_values, ind)
      val
    })

  let trees_south =
    list.range(y + 1, list.length(col_values) - 1)
    |> list.map(fn(ind) {
      assert Ok(val) = list.at(col_values, ind)
      val
    })

  let trees_west =
    list.range(0, x - 1)
    |> list.map(fn(ind) {
      assert Ok(val) = list.at(row_values, ind)
      val
    })

  let east_count =
    list.fold(
      trees_east,
      #(0, True),
      fn(accum, tree_in_row_height) {
        case accum {
          #(_, False) -> accum
          _ ->
            case height {
              h if h == tree_in_row_height -> #(accum.0 + 1, False)
              h if h < tree_in_row_height && accum.1 == True -> #(
                accum.0 + 1,
                False,
              )
              h if h > tree_in_row_height -> #(accum.0 + 1, True)
              _ -> #(accum.0, False)
            }
        }
      },
    )

  let north_count =
    list.fold(
      list.reverse(trees_north),
      #(0, True),
      fn(accum, tree_in_row_height) {
        case accum {
          #(_, False) -> accum
          _ ->
            case height {
              h if h == tree_in_row_height -> #(accum.0 + 1, False)
              h if h < tree_in_row_height && accum.1 == True -> #(
                accum.0 + 1,
                False,
              )
              h if h > tree_in_row_height -> #(accum.0 + 1, True)
              _ -> #(accum.0, False)
            }
        }
      },
    )

  let south_count =
    list.fold(
      trees_south,
      #(0, True),
      fn(accum, tree_in_row_height) {
        case accum {
          #(_, False) -> accum
          _ ->
            case height {
              h if h == tree_in_row_height -> #(accum.0 + 1, False)
              h if h < tree_in_row_height && accum.1 == True -> #(
                accum.0 + 1,
                False,
              )
              h if h > tree_in_row_height -> #(accum.0 + 1, True)
              _ -> #(accum.0, False)
            }
        }
      },
    )

  let west_count =
    list.fold(
      list.reverse(trees_west),
      #(0, True),
      fn(accum, tree_in_row_height) {
        case accum {
          #(_, False) -> accum
          _ ->
            case height {
              h if h == tree_in_row_height -> #(accum.0 + 1, False)
              h if h < tree_in_row_height && accum.1 == True -> #(
                accum.0 + 1,
                False,
              )
              h if h > tree_in_row_height -> #(accum.0 + 1, True)
              _ -> #(accum.0, False)
            }
        }
      },
    )

  north_count.0 * east_count.0 * south_count.0 * west_count.0
}

pub fn convert_input_to_grid(input: String) -> Grid {
  assert Ok(res) =
    // split on new line
    string.split(input, on: "\n")
    // for each line
    |> list.try_map(fn(line) {
      // split on chars
      string.split(line, on: "")
      // convert to int
      |> list.try_map(int.parse)
    })

  res
}

pub fn main() {
  assert Ok(file) =
    file.read(
      from: "/Users/koryporter/dev/personal/2022-advent-of-code/day-8/puzzle_2/src/input.txt",
    )

  let grid = convert_input_to_grid(file)

  let scenic_scores =
    list.index_fold(
      grid,
      [],
      fn(row_scenic_scores, row_contents, y_index) {
        let scores =
          row_contents
          |> list.index_map(fn(x_index, _) {
            let coord = #(x_index, y_index)
            case is_edge(grid, coord) {
              True -> 0
              False ->
                case get_tree_scenic_score(grid, coord) {
                  0 -> 0
                  _ as n -> n
                }
            }
          })

        list.append(row_scenic_scores, scores)
      },
    )

  assert Ok(most_scenic) =
    list.filter(scenic_scores, fn(v) { v != 0 })
    |> list.sort(by: int.compare)
    |> list.last

  io.debug(most_scenic)
}
