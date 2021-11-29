package leetcode

import "math"

func minMoves(nums []int) int {
	min, sum := math.MaxInt64, 0

	for _, v := range nums {
		sum += v
		if v < min {
			min = v
		}
	}

	return sum - len(nums)*min
}
