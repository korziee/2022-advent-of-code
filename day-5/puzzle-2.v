import os

struct Move {
	amount_crates int
	from_stack    int
	to_stack      int
}

fn parse_move(move string) Move {
	chars := move.split(' ')

	// move 3 from 2 to 5
	return Move{chars[1].int(), chars[3].int(), chars[5].int()}
}

fn parse_stacks(data string) map[int][]string {
	mut m := map[int][]string{}

	rows := data.split_into_lines()
	columns := rows.pop().trim_space().split('   ')

	// use last row to work out how many columns
	for _, column in columns {
		m[column.int()] = []string{}
	}

	// reverse to make the code read better
	for _, row in rows.reverse() {
		// for each col
		for c := 0; c < columns.len; c += 1 {
			// offset by 4 to cater for the 4 characters used to represent each col
			// + 1 at the end to get the "crate" id
			crate := row[(c * 4) + 1].ascii_str()
			// if the crate is not a space, write it down
			if crate != ' ' {
				m[c + 1] << crate.str()
			}
		}
	}

	return m
}

input := os.read_file('input') ?
res := input.split('\n\n')
moves := res[1].split_into_lines()
mut stack := parse_stacks(res[0])

for _, raw_move in moves {
	move := parse_move(raw_move)
	mut i := 0

	mut temp_crates := []string{}
	for i < move.amount_crates {
		i++
		temp_crates << stack[move.from_stack].pop()
	}

	stack[move.to_stack] << temp_crates.reverse()
}

for _, key in stack.keys() {
	ascii := stack[key].last().str()
	println('$key-$ascii')
}
