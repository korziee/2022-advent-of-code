import os
import strconv

input := os.read_file('input') ?
lines := input.split_into_lines()

mut elf_cals := []int{}
mut elf_cal := 0

for line in lines {
	if line.len == 0 {
		elf_cals << elf_cal
		elf_cal = 0
	} else {
		converted := strconv.atoi(line) or { 0 }
		elf_cal = elf_cal + converted
	}
}

elf_cals.sort()
elf_cals.reverse_in_place()

top_three_total := elf_cals[0] + elf_cals[1] + elf_cals[2]

println(top_three_total)
