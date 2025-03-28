package main

import (
	"fmt"
	"log"

	"ssh-log-monitor/grpcclient"
	"ssh-log-monitor/parser"
	"ssh-log-monitor/state"
)

const (
	logPath     = "/var/log/auth.log"
	offsetPath  = "offset.txt"
	grpcAddress = "grpc-cyberscope.rickokkersen.nl:443"
)

func main() {
	offset, err := state.ReadOffset(offsetPath)
	if err != nil {
		log.Fatalf("Failed to read offset: %v", err)
	}

	entries, newOffset, err := parser.ParseAuthLog(logPath, offset)
	if err != nil {
		log.Fatalf("Failed to parse auth.log: %v", err)
	}

	fmt.Printf("Scanned auth.log – Found %d entries | New offset: %d\n", len(entries), newOffset)
	for _, entry := range entries {
		fmt.Printf("➡️ Found SSH login attempt from IP %s at %s\n", entry.IP, entry.Timestamp)
	}

	for _, entry := range entries {
		log.Printf("Sending log for IP %s at %s", entry.IP, entry.Timestamp)

		if err := grpcclient.SendLog(grpcAddress, entry.IP, entry.Timestamp); err != nil {
			log.Printf("gRPC send failed: %v", err)
		}
	}

	if err := state.WriteOffset(offsetPath, newOffset); err != nil {
		log.Printf("Failed to write offset: %v", err)
	}
}
