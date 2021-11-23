func findMaxConsecutiveOnes(nums []int) int {
	currentConsecutiveOnes, maxConsecutiveOnes := 0, 0

	for _, v := range nums {
		if v == 0 {
			currentConsecutiveOnes = 0
		} else {
			currentConsecutiveOnes++
		}

		if currentConsecutiveOnes > maxConsecutiveOnes {
			maxConsecutiveOnes = currentConsecutiveOnes
		}
	}

	return maxConsecutiveOnes
}