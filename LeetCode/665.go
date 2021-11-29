package leetcode

func checkPossibility(nums []int) bool {
	counts := 0

	for i := 0; i < len(nums)-1; i++ {
		if nums[i] > nums[i+1] {
			counts++
			if counts == 2 {
				return false
			}
			if i != 0 && nums[i+1] < nums[i-1] {
				nums[i+1] = nums[i]
			}
		}
	}

	return true
}
