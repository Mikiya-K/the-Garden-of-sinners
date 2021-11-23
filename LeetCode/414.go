package leetcode

import "math"

func thirdMax(nums []int) int {
	max, medium, min := math.MinInt64, math.MinInt64, math.MinInt64

	for _, v := range nums {
		switch {
		case v > max:
			{
				min = medium
				medium = max
				max = v
			}
		case v < max && v > medium:
			{
				min = medium
				medium = v
			}
		case v < medium && v > min:
			{
				min = v
			}
		}
	}

	if min == math.MinInt64 {
		return max
	} else {
		return min
	}
}
