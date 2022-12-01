import os
import strconv

input := os.read_file('input')?
lines := input.split_into_lines()

mut max_cal := 0
mut elf_cal := 0

for line in lines {
	if line.len == 0 {
		if elf_cal > max_cal {
			max_cal = elf_cal
		}
		elf_cal = 0
	} else {
		converted := strconv.atoi(line) or { 0 }
		elf_cal = elf_cal + converted
	}
}

println(max_cal)