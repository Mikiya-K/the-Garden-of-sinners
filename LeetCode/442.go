package leetcode

func findDuplicates(nums []int) []int {
	n := len(nums)

	for _, v := range nums {
		if v%n == 0 {
			nums[n-1] += n
		} else {
			nums[v%n-1] += n
		}
	}

	result := make([]int, 0)
	for k, v := range nums {
		if v >= 2*n+1 {
			result = append(result, k+1)
		}
	}

	return result
}
