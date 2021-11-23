package leetcode

func findPoisonedDuration(timeSeries []int, duration int) int {
	poisonedDuration := 0

	for i := 0; i < len(timeSeries)-1; i++ {
		if interval := timeSeries[i+1] - timeSeries[i]; interval >= duration {
			poisonedDuration += duration
		} else {
			poisonedDuration += interval
		}
	}
	poisonedDuration += duration

	return poisonedDuration
}
