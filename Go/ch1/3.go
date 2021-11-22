package main

import (
	"bufio"
	"fmt"
	"os"
)

func main() {
	counts := make(map[string]int)
	files := os.Args[1:]

	if len(files) == 0 {
		countLines(os.Stdin, counts)
	} else {
		for _, v := range files {
			f, err := os.Open(v)
			if err == nil {
				countLines(f, counts)
			}
		}
	}

	for k, v := range counts {
		if v > 0 {
			fmt.Println(v, k)
		}
	}
}

func countLines(f *os.File, counts map[string]int) {
	input := bufio.NewScanner(f)
	for input.Scan() {
		counts[input.Text()]++
	}
}
