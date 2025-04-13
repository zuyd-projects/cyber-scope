package parser

import (
	"bufio"
	"fmt"
	"os"
	"regexp"
)

type SSHLogEntry struct {
	IP        string
	Timestamp string
}

// sshRegex matches lines like:
// 2025-03-27T14:24:14.101674+01:00 cyberscope-Standard-PC-i440FX-PIIX-1996 sshd[43460]: Connection closed by invalid user noaheutz 83.82.26.140 port 63761 [preauth]
var sshRegex = regexp.MustCompile(`sshd\[\d+\]: (Accepted|Failed) password for .* from ([0-9.]+) port`)
var repeatedRegex = regexp.MustCompile(`message repeated \d+ times: \[.*from ([0-9.]+) port`)
var timestampRegex = regexp.MustCompile(`^([\d\-T:+\.]+)`)

func ParseAuthLog(path string, lastLine int64) ([]SSHLogEntry, int64, error) {
	file, err := os.Open(path)
	if err != nil {
		return nil, lastLine, err
	}
	defer file.Close()

	// Count total lines in the file
	totalLines := countLines(file)

	// If the stored offset is larger than the total lines in the file,
	// the file was likely rotated. Reset the offset to 0.
	if totalLines < lastLine {
		fmt.Printf("⚠️ File rotation detected: file has %d lines but offset is %d. Resetting offset to 0.\n",
			totalLines, lastLine)
		lastLine = 0
	}

	// Return to the beginning of the file for processing
	_, err = file.Seek(0, 0)
	if err != nil {
		return nil, lastLine, err
	}

	var entries []SSHLogEntry
	scanner := bufio.NewScanner(file)
	var currentLine int64 = 0

	for scanner.Scan() {
		currentLine++
		if currentLine <= lastLine {
			continue
		}

		line := scanner.Text()

		timestampMatch := timestampRegex.FindStringSubmatch(line)
		timestamp := ""
		if len(timestampMatch) > 1 {
			timestamp = timestampMatch[1] // Only the timestamp part
		}

		match := sshRegex.FindStringSubmatch(line)
		if len(match) == 3 {
			ip := match[2]
			fmt.Println("🎯 MATCH FOUND:", ip, "at", timestamp)
			entries = append(entries, SSHLogEntry{IP: ip, Timestamp: timestamp})
			continue
		}

		match = repeatedRegex.FindStringSubmatch(line)
		if len(match) == 2 {
			ip := match[1]
			fmt.Println("🔁 REPEATED MATCH FOUND:", ip, "at", timestamp)
			entries = append(entries, SSHLogEntry{IP: ip, Timestamp: timestamp})
		}
	}

	return entries, currentLine, scanner.Err()
}

// countLines counts the total number of lines in a file
func countLines(file *os.File) int64 {
	// Save the current position to restore it later
	currentPos, err := file.Seek(0, os.SEEK_CUR)
	if err != nil {
		return 0
	}

	// Move to the beginning of the file
	_, err = file.Seek(0, 0)
	if err != nil {
		return 0
	}

	// Count the lines
	scanner := bufio.NewScanner(file)
	var lineCount int64 = 0
	for scanner.Scan() {
		lineCount++
	}

	// Restore the file position
	_, _ = file.Seek(currentPos, 0)

	return lineCount
}
