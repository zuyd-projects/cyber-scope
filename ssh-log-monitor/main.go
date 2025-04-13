package main

import (
	"context"
	"fmt"
	"log"
	"time"

	"ssh-log-monitor/grpcclient"
	"ssh-log-monitor/parser"
	"ssh-log-monitor/state"
)

const (
	logPath     = "/var/log/auth.log"
	offsetPath  = "/var/lib/ssh-monitor/offset.txt"
	grpcAddress = "grpc-cyberscope.rickokkersen.nl:443"
	timeout     = time.Minute
)

func main() {
	log.Println("🚀 Starting SSH log monitor...")
	startTime := time.Now()

	// Create a context with a X-minute timeout
	ctx, cancel := context.WithTimeout(context.Background(), timeout)
	defer cancel()
	log.Printf("⏱️ Set execution timeout: %v", timeout)

	// Acquire lock to prevent concurrent runs
	log.Println("🔒 Attempting to acquire lock...")
	if err := state.AcquireLock(); err != nil {
		log.Fatalf("❌ Failed to acquire lock: %v", err)
	}
	log.Println("✅ Lock acquired successfully")
	defer func() {
		if err := state.ReleaseLock(); err != nil {
			log.Printf("⚠️ Failed to release lock: %v", err)
		} else {
			log.Println("🔓 Lock released successfully")
		}
	}()

	offset, err := state.ReadOffset(offsetPath)
	if err != nil {
		log.Fatalf("❌ Failed to read offset from %s: %v", offsetPath, err)
	}
	log.Printf("📋 Read offset: %d from %s", offset, offsetPath)

	log.Printf("📖 Parsing auth log from %s starting at offset %d...", logPath, offset)
	entries, newOffset, err := parser.ParseAuthLog(logPath, offset)
	if err != nil {
		log.Fatalf("❌ Failed to parse auth.log: %v", err)
	}

	log.Printf("📊 Scan complete - Found %d entries | New offset: %d", len(entries), newOffset)
	if len(entries) == 0 {
		log.Println("ℹ️ No new SSH login attempts found, nothing to process")
		// Even with no entries, update to the new offset
		if newOffset != offset {
			if err := state.WriteOffset(offsetPath, newOffset); err != nil {
				log.Printf("⚠️ Failed to update offset to %d: %v", newOffset, err)
			} else {
				log.Printf("💾 Offset updated to %d", newOffset)
			}
		}
	} else {
		log.Printf("🔍 Found %d SSH login attempts to process", len(entries))
	}

	for _, entry := range entries {
		fmt.Printf("➡️ Found SSH login attempt from IP %s at %s\n", entry.IP, entry.Timestamp)
	}

	// Process entries, and write the final offset at the end
	for i, entry := range entries {
		select {
		case <-ctx.Done():
			log.Printf("⚠️ Timeout reached after %v, stopping execution", time.Since(startTime))
			// Write the last processed offset before exiting
			if err := state.WriteOffset(offsetPath, newOffset); err != nil {
				log.Printf("❌ Failed to write final offset %d: %v", newOffset, err)
			} else {
				log.Printf("💾 Saved partial progress: offset updated to %d before timeout", newOffset)
			}
			return
		default:
			log.Printf("🔄 Processing entry %d/%d: IP %s at %s", i+1, len(entries), entry.IP, entry.Timestamp)

			sendStart := time.Now()
			if err := grpcclient.SendLog(grpcAddress, entry.IP, entry.Timestamp); err != nil {
				log.Printf("❌ gRPC send failed for IP %s: %v", entry.IP, err)
			} else {
				log.Printf("✅ Successfully sent log for IP %s (took %v)", entry.IP, time.Since(sendStart))
			}
		}
	}

	// Update the offset only once after all entries are processed
	if len(entries) > 0 {
		if err := state.WriteOffset(offsetPath, newOffset); err != nil {
			log.Printf("⚠️ Failed to update final offset to %d: %v", newOffset, err)
		} else {
			log.Printf("💾 Final offset updated to %d", newOffset)
		}
	}

	processingTime := time.Since(startTime)
	log.Printf("✅ Processing complete! Processed %d entries in %v", len(entries), processingTime)
	if len(entries) > 0 {
		log.Printf("📈 Average processing time: %v per entry", processingTime/time.Duration(len(entries)))
	}
}
