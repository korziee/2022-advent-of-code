package main

import (
	"fmt"
	"io/fs"
	"os"
	"path/filepath"
	"strconv"
	"strings"
)

type range_ struct {
	start int
	end   int
}

func getElfSectionRange(rangee string) range_ {
	r := strings.Split(rangee, "-")
	r1, _ := strconv.Atoi(r[0])
	r2, _ := strconv.Atoi(r[1])
	return range_{start: r1, end: r2}
}

// checks if r2 is contained within r1
func rangeContainsRange(r1 range_, r2 range_) bool {
	return r1.start >= r2.start && r1.end <= r2.end
}

func main() {
	ex, err := os.Executable()
	if err != nil {
		panic(err)
	}

	file, err := fs.ReadFile(os.DirFS(filepath.Dir(ex)), "input")
	if err != nil {
		panic(err)
	}
	lines := strings.Split(string(file), "\n")
	overlapping := 0

	for i := 0; i < len(lines); i++ {
		pair := strings.Split(lines[i], ",")
		elfOneRange := getElfSectionRange(pair[0])
		elfTwoRange := getElfSectionRange(pair[1])

		// todo: could be smarter like the following but for now keep simp
		if rangeContainsRange(elfOneRange, elfTwoRange) || rangeContainsRange(elfTwoRange, elfOneRange) {
			overlapping += 1
			fmt.Println("yes", i, pair)
		}
	}

	fmt.Println("Overlapping", overlapping)
	// split on new line
}

// I think second puzzle will get me to compare the entire elves list
// sort ascending
