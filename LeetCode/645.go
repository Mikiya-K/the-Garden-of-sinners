package leetcode

func findErrorNums(nums []int) []int {
	record := make([]int, len(nums))
	result := make([]int, 2)

	for _, v := range nums {
		record[v-1]++
	}

	for k, v := range record {
		switch v {
		case 2:
			result[0] = k + 1
		case 0:
			result[1] = k + 1
		}
	}

	return result
}
