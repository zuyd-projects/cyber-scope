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

	ips, newOffset, err := parser.ParseAuthLog(logPath, offset)
	if err != nil {
		log.Fatalf("Failed to parse auth.log: %v", err)
	}

	// 👇 DEBUG
	fmt.Printf("Scanned auth.log – Found %d IPs | New offset: %d\n", len(ips), newOffset)
	for _, ip := range ips {
		fmt.Println("➡️ Found SSH login attempt from IP:", ip)
	}

	for _, ip := range ips {
		log.Printf("Sending log for IP %s", ip)

		if err := grpcclient.SendLog(grpcAddress, ip); err != nil {
			log.Printf("gRPC send failed: %v", err)
		}
	}

	if err := state.WriteOffset(offsetPath, newOffset); err != nil {
		log.Printf("Failed to write offset: %v", err)
	}
}
