package leetcode

func findDisappearedNumbers(nums []int) []int {
	for _, v := range nums {
		switch {
		case v > 0 && nums[v-1] > 0:
			nums[v-1] = -nums[v-1]
		case v < 0 && nums[-v-1] > 0:
			nums[-v-1] = -nums[-v-1]
		}
	}

	result := make([]int, 0)
	for k, v := range nums {
		if v > 0 {
			result = append(result, k+1)
		}
	}

	return result
}
