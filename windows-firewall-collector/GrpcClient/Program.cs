using Grpc.Core;
using Grpc.Net.Client;
using System;
using System.Net.Http;

namespace GrpcClient
{
    internal class Program
    {
        static void Main(string[] args)
        {
            if (args.Length < 3)
            {
                Console.WriteLine("Usage: GrpcClient.exe \"data string\"");
                return;
            }

            string device_id = args[0];
            string source_ip = args[1];
            string timestamp = args[2];
            string action = args[3];
            int srcPort = int.Parse(args[4]);
            int dstPort = int.Parse(args[5]);

            var httpHandler = new StandardSocketsHttpHandler();
            var channelOptions = new GrpcChannelOptions
            {
                HttpHandler = httpHandler,
                Credentials = ChannelCredentials.SecureSsl
            };
            var channel = GrpcChannel.ForAddress("https://grpcdev-cyberscope.rickokkersen.nl", channelOptions);
            var packetClient = new LogService.LogServiceClient(channel);

            var request = new WindowsLogRequest
            {
                DeviceId = device_id,
                SourceIp = source_ip,
                Timestamp = timestamp,
                Action = action,
                SrcPort = srcPort,
                DstPort = dstPort,
            };

            try
            {
                var response = packetClient.SendWindowsLog(request);
            }
            catch (RpcException e)
            {
                //Console.WriteLine($"Error sending log: {e.Status.Detail}");
            }
            catch (Exception e)
            {
                Console.WriteLine($"Error sending log: {e.Message}");
            }
        }
    }
}
