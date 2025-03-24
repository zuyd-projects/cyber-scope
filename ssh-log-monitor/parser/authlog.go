package parser

import (
	"bufio"
	"fmt"
	"os"
	"regexp"
)

// sshRegex matches lines like:
// "sshd[12345]: Failed password for <user> from 1.2.3.4 port 12345 ssh2"
var sshRegex = regexp.MustCompile(`sshd$begin:math:display$\\d+$end:math:display$: (Accepted|Failed) password for .* from ([0-9.]+) port`)
var repeatedRegex = regexp.MustCompile(`message repeated \d+ times: \[ Failed password for .* from ([0-9.]+) port`)

func ParseAuthLog(path string, lastLine int64) ([]string, int64, error) {
	file, err := os.Open(path)
	if err != nil {
		return nil, lastLine, err
	}
	defer file.Close()

	var ips []string
	scanner := bufio.NewScanner(file)
	var currentLine int64 = 0

	for scanner.Scan() {
		currentLine++
		if currentLine <= lastLine {
			continue
		}

		line := scanner.Text()
		fmt.Println("LINE:", line) // Debug print

		match := sshRegex.FindStringSubmatch(line)
		if len(match) == 3 {
			fmt.Println("🎯 MATCH FOUND:", match[2])
			ips = append(ips, match[2]) // [2] is het IP-adres
		}

		match = repeatedRegex.FindStringSubmatch(line)
		if len(match) == 2 {
			fmt.Println("🔁 REPEATED MATCH FOUND:", match[1])
			ips = append(ips, match[1])
		}
	}

	return ips, currentLine, scanner.Err()
}
