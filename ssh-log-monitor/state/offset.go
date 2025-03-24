package state

import (
	"os"
	"strconv"
)

// ReadOffset reads the offset from the given file path.
// If the file does not exist, it returns 0.
func ReadOffset(path string) (int64, error) {
	data, err := os.ReadFile(path)
	if err != nil {
		return 0, nil // First run
	}
	return strconv.ParseInt(string(data), 10, 64)
}

// WriteOffset writes the offset to the given file path.
func WriteOffset(path string, offset int64) error {
	return os.WriteFile(path, []byte(strconv.FormatInt(offset, 10)), 0644)
}
