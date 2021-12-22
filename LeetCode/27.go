package leetcode

func removeElement(nums []int, val int) int {
	left, right, n := 0, 0, len(nums)

	for right < n {
		if nums[right] != val {
			nums[left] = nums[right]
			left++
		}
		right++
	}

	return left
}
