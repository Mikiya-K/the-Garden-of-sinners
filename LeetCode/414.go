func thirdMax(nums []int) int {
	distinct := make(map[int]int)
	max, medium, min := math.MinInt64, math.MinInt64, math.MinInt64

	for _, v := range nums {
		distinct[v]++

		switch {
		case v > max:
			{
				min = medium
				medium = max
				max = v
			}
		case v < max && v > medium:
			{
				min = medium
				medium = v
			}
		case v < medium && v > min:
			{
				min = v
			}
		}
	}

	if len(distinct) < 3 {
		return max
	} else {
		return min
	}
}