package leetcode

func findShortestSubArray(nums []int) int {
	record := make(map[int][]int)

	for k, v := range nums {
		if _, ok := record[v]; ok == false {
			record[v] = []int{1, k, k}
		} else {
			record[v][0]++
			record[v][2] = k
		}
	}

	du, len := 0, 0
	for _, v := range record {
		switch {
		case v[0] > du:
			{
				du = v[0]
				len = v[2] - v[1] + 1
			}
		case v[0] == du:
			{
				if v[2]-v[1]+1 < len {
					len = v[2] - v[1] + 1
				}
			}
		}
	}

	return len
}
