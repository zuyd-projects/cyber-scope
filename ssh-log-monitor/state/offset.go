package state

import (
	"errors"
	"os"
	"strconv"
	"strings"
	"time"
)

const lockFilePath = "process.lock"
const maxLockAttempts = 3
const lockTimeout = time.Minute * 5 // Max runtime is 1 minute, so 5 minutes guarantees a dead lock

// AcquireLock creates a lock file to prevent concurrent runs.
// If the lock file exists, it will check the timestamp and attempt counter.
// After maxLockAttempts, it will force-release the lock.
func AcquireLock() error {
	// Check if lock file exists
	_, err := os.Stat(lockFilePath)

	if err == nil {
		// Lock file exists, read current counter
		data, err := os.ReadFile(lockFilePath)
		if err != nil {
			return err
		}

		// Parse counter and timestamp from lock file
		var counter int
		var timestamp int64

		// Default values if lockfile is in unexpected format
		counter = 1
		timestamp = time.Now().Unix() - 3600 // Default to an hour ago

		// Try to parse the contents (format: "counter:timestamp")
		contents := string(data)
		parts := splitLockData(contents)
		if len(parts) >= 2 {
			if c, err := strconv.Atoi(parts[0]); err == nil {
				counter = c
			}
			if ts, err := strconv.ParseInt(parts[1], 10, 64); err == nil {
				timestamp = ts
			}
		}

		// If file older than lockTimeout, consider it abandoned
		if time.Now().Unix()-timestamp > int64(lockTimeout.Seconds()) {
			// Force release the lock - previous process has timed out
			_ = os.Remove(lockFilePath)
		} else if counter >= maxLockAttempts {
			// Max attempts reached, force release the lock
			_ = os.Remove(lockFilePath)
		} else {
			// Increment counter and update timestamp
			counter++
			file, err := os.Create(lockFilePath)
			if err != nil {
				return err
			}
			_, err = file.WriteString(strconv.Itoa(counter) + ":" + strconv.FormatInt(time.Now().Unix(), 10))
			file.Close()
			if err != nil {
				return err
			}
			return errors.New("another process is already running")
		}
	}

	// Create new lockfile with counter 1
	file, err := os.Create(lockFilePath)
	if err != nil {
		return err
	}
	defer file.Close()

	// Write counter and current timestamp
	_, err = file.WriteString("1:" + strconv.FormatInt(time.Now().Unix(), 10))
	return err
}

// ReleaseLock removes the lock file.
func ReleaseLock() error {
	return os.Remove(lockFilePath)
}

// Helper function to split lock file data
func splitLockData(data string) []string {
	for i := 0; i < len(data); i++ {
		if data[i] == ':' {
			return []string{data[:i], data[i+1:]}
		}
	}
	return []string{data}
}

// ReadOffset reads the offset from the given file path.
// If the file does not exist, it returns 0.
func ReadOffset(path string) (int64, error) {
	data, err := os.ReadFile(path)
	if err != nil {
		return 0, nil // First run
	}
	// Trim whitespace and newlines before parsing
	trimmedData := string(data)
	trimmedData = strings.TrimSpace(trimmedData)
	return strconv.ParseInt(trimmedData, 10, 64)
}

// WriteOffset writes the offset to the given file path.
func WriteOffset(path string, offset int64) error {
	return os.WriteFile(path, []byte(strconv.FormatInt(offset, 10)), 0644)
}
