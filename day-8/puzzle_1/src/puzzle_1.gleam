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

pub fn is_visible(grid: Grid, coordinate: Coordinate) -> Bool {
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

  let visible_east =
    list.range(x + 1, list.length(row_values) - 1)
    |> list.map(fn(ind) {
      assert Ok(val) = list.at(row_values, ind)
      val
    })
    |> list.fold(
      True,
      fn(accum, tree_in_row_height) {
        case accum {
          False -> False
          _ -> height > tree_in_row_height
        }
      },
    )

  // look RIGHT of y co-ordinate
  let visible_west =
    list.range(0, x - 1)
    |> list.map(fn(ind) {
      assert Ok(val) = list.at(row_values, ind)
      val
    })
    |> list.fold(
      True,
      fn(accum, tree_in_row_height) {
        case accum {
          False -> False
          _ -> height > tree_in_row_height
        }
      },
    )

  let visible_north =
    list.range(0, y - 1)
    |> list.map(fn(ind) {
      assert Ok(val) = list.at(col_values, ind)
      val
    })
    |> list.fold(
      True,
      fn(accum, tree_in_row_height) {
        case accum {
          False -> False
          _ -> height > tree_in_row_height
        }
      },
    )

  let visible_south =
    list.range(y + 1, list.length(col_values) - 1)
    |> list.map(fn(ind) {
      assert Ok(val) = list.at(col_values, ind)
      val
    })
    |> list.fold(
      True,
      fn(accum, tree_in_row_height) {
        case accum {
          False -> False
          _ -> height > tree_in_row_height
        }
      },
    )

  visible_north || visible_east || visible_south || visible_west
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
      from: "/Users/koryporter/dev/personal/2022-advent-of-code/day-8/puzzle_1/src/input.txt",
    )

  let grid = convert_input_to_grid(file)

  let visible_trees =
    list.index_fold(
      grid,
      [],
      fn(visible_trees, row_contents, y_index) {
        let trees_visible_in_row =
          row_contents
          |> list.index_map(fn(x_index, _) {
            let coord = #(x_index, y_index)
            case is_edge(grid, coord) {
              True -> Ok(coord)
              False ->
                case is_visible(grid, coord) {
                  True -> Ok(coord)
                  False -> Error(Nil)
                }
            }
          })
          |> list.filter(result.is_ok)
        list.append(visible_trees, trees_visible_in_row)
      },
    )

  io.debug("Visible Trees = " <> int.to_string(list.length(visible_trees)))
}
