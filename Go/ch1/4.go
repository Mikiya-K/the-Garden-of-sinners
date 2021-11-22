package main

import (
	"fmt"
	"io/ioutil"
	"os"
	"strings"
)

func main() {
	counts := make(map[string]int)
	files := os.Args[1:]

	for _, filename := range files {
		data, err := ioutil.ReadFile(filename)

		if err != nil {
			fmt.Println(err)
			fmt.Printf("dup3: %v\n", err)
			fmt.Fprintf(os.Stderr, "dup3: %v\n", err)
			continue
		}

		lines := strings.Split(string(data), "\n")
		for _, v := range lines {
			counts[v]++
		}
	}

	for k, v := range counts {
		if v > 0 {
			fmt.Println(v, k)
		}
	}
}
