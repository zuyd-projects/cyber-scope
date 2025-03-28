package parser

import (
	"bufio"
	"fmt"
	"os"
	"regexp"
	"strings"
)

type SSHLogEntry struct {
	IP        string
	Timestamp string
}

// sshRegex matches lines like:
// 2025-03-27T14:24:14.101674+01:00 cyberscope-Standard-PC-i440FX-PIIX-1996 sshd[43460]: Connection closed by invalid user noaheutz 83.82.26.140 port 63761 [preauth]
var sshRegex = regexp.MustCompile(`sshd$begin:math:display$\\d+$end:math:display$: (Accepted|Failed) password for .* from ([0-9.]+) port`)
var repeatedRegex = regexp.MustCompile(`message repeated \d+ times: \[ Failed password for .* from ([0-9.]+) port`)

func ParseAuthLog(path string, lastLine int64) ([]SSHLogEntry, int64, error) {
	file, err := os.Open(path)
	if err != nil {
		return nil, lastLine, err
	}
	defer file.Close()

	var entries []SSHLogEntry
	scanner := bufio.NewScanner(file)
	var currentLine int64 = 0

	for scanner.Scan() {
		currentLine++
		if currentLine <= lastLine {
			continue
		}

		line := scanner.Text()

		timestamp := strings.SplitN(line, " ", 2)[0]

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
