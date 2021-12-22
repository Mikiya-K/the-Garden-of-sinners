package leetcode

func removeDuplicates(nums []int) int {
	left, right, n := 2, 2, len(nums)

	if n <= 2 {
		return n
	}

	for right < n {
		if nums[right] > nums[left-2] {
			nums[left] = nums[right]
			left++
		}

		right++
	}

	return left
}
