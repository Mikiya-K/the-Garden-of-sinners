package leetcode

import "math"

func maximumProduct(nums []int) int {
	max1, max2, max3 := math.MinInt64, math.MinInt64, math.MinInt64
	min1, min2 := math.MaxInt64, math.MaxInt64

	for _, v := range nums {
		switch {
		case v > max1:
			{
				max3 = max2
				max2 = max1
				max1 = v
			}
		case v <= max1 && v > max2:
			{
				max3 = max2
				max2 = v
			}
		case v <= max2 && v > max3:
			{
				max3 = v
			}
		}

		switch {
		case v < min1:
			{
				min2 = min1
				min1 = v
			}
		case v >= min1 && v < min2:
			{
				min2 = v
			}
		}
	}

	if max1*max2*max3 >= min1*min2*max1 {
		return max1 * max2 * max3
	} else {
		return min1 * min2 * max1
	}
}
