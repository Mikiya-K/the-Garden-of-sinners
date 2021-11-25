package leetcode

import "math"

func firstMissingPositive(nums []int) int {
	n := len(nums)

	for i, v := range nums {
		if v <= 0 {
			nums[i] = n + 1
		}
	}

	for _, v := range nums {
		if vAbs := int(math.Abs(float64(v))); vAbs <= n {
			nums[vAbs-1] = -int(math.Abs(float64(nums[vAbs-1])))
		}
	}

	for i, v := range nums {
		if v > 0 {
			return i + 1
		}
	}
	return n + 1
}
