package grpcclient

import (
	"context"
	"time"

	"ssh-log-monitor/geo"
	pb "ssh-log-monitor/proto"

	"google.golang.org/grpc"
	"google.golang.org/grpc/credentials"
)

func SendLog(serverAddr string, geoData *geo.GeoData) error {
	creds := credentials.NewClientTLSFromCert(nil, "")
	conn, err := grpc.Dial(serverAddr, grpc.WithTransportCredentials(creds))
	if err != nil {
		return err
	}
	defer conn.Close()

	client := pb.NewLogServiceClient(conn)

	_, err = client.SendLog(context.Background(), &pb.LogRequest{
		DeviceId:        "ubuntu-vm",
		SourceIp:        geoData.Query,
		DestinationIp:   "",
		SourcePort:      22,
		DestinationPort: 0,
		Size:            0,
		Timestamp:       time.Now().Format(time.RFC3339),
		Type:            pb.PacketType_TCP,
		ProcessId:       0,
		ProcessName:     "sshd",
		ExecutablePath:  "/usr/sbin/sshd",
		FileHash:        "",
	})
	return err
}
