package leetcode

func removeDuplicates(nums []int) int {
	left, right, n := 1, 1, len(nums)

	if n == 0 || nums == nil {
		return 0
	}

	for right < n {
		if nums[right] != nums[left-1] {
			nums[left] = nums[right]
			left++
		}
		right++
	}

	return left
}
