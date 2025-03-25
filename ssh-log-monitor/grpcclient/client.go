package grpcclient

import (
	"context"
	"os"
	"time"

	pb "ssh-log-monitor/proto"

	"google.golang.org/grpc"
	"google.golang.org/grpc/credentials"
)

func SendLog(serverAddr string, sourceIp string) error {
	creds := credentials.NewClientTLSFromCert(nil, "")
	conn, err := grpc.Dial(serverAddr, grpc.WithTransportCredentials(creds))
	if err != nil {
		return err
	}
	defer conn.Close()

	client := pb.NewLogServiceClient(conn)

	hostname, err := os.Hostname()
	if err != nil {
		hostname = "unknown-device"
	}

	_, err = client.SendLinuxLog(context.Background(), &pb.LinuxLogRequest{
		DeviceId:    hostname,
		SourceIp:    sourceIp,
		Timestamp:   time.Now().Format(time.RFC3339),
		ProcessName: "sshd",
	})
	return err
}
