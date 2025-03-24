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

	_, err = client.SendLinuxLog(context.Background(), &pb.LinuxLogRequest{
		DeviceId:    "ubuntu-vm",
		SourceIp:    geoData.Query,
		Timestamp:   time.Now().Format(time.RFC3339),
		ProcessName: "sshd",
	})
	return err
}
