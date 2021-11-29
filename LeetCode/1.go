package leetcode

func twoSum(nums []int, target int) []int {
	record := make(map[int]int)

	for i, v := range nums {
		if k, ok := record[target-v]; ok == true && i != k {
			return []int{i, k}
		} else {
			record[v] = i
		}
	}

	return nil
}
