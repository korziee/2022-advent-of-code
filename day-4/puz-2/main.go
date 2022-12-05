package main

import (
	"fmt"
	"io/fs"
	"math"
	"os"
	"path/filepath"
	"strconv"
	"strings"
)

type range_ struct {
	start int
	end   int
}

func getElfSectionRange(r string) range_ {
	split := strings.Split(r, "-")
	r1, _ := strconv.Atoi(split[0])
	r2, _ := strconv.Atoi(split[1])
	return range_{start: r1, end: r2}
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

		maxEnd := math.Max(float64(elfOneRange.end), float64(elfTwoRange.end))
		minStart := math.Min(float64(elfOneRange.start), float64(elfTwoRange.start))

		if (maxEnd - minStart) <= (float64((elfOneRange.end - elfOneRange.start) + (elfTwoRange.end - elfTwoRange.start))) {
			overlapping += 1
		}
	}

	fmt.Println("Overlapping", overlapping)
}
