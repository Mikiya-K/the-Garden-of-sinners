package leetcode

func findErrorNums(nums []int) []int {
	n := len(nums)

	for _, v := range nums {
		if v%n == 0 {
			nums[n-1] += n
		} else {
			nums[v%n-1] += n
		}
	}

	result := make([]int, 2)
	for k, v := range nums {
		switch {
		case v <= n:
			result[1] = k + 1
		case v >= 2*n+1:
			result[0] = k + 1
		}
	}

	return result
}
