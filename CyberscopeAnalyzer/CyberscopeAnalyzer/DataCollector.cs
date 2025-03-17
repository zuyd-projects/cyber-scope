using CyberscopeAnalyzer.Models;
using Grpc.Core;
using Grpc.Net.Client;
using Microsoft.Win32;
using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;

namespace CyberscopeAnalyzer
{
    internal class DataCollector
    {
        // Create a singleton instance of the DataCollector class
        private static DataCollector instance = null;
        private static readonly object padlock = new object();

        private static LogService.LogServiceClient logClient;
        private ConcurrentDictionary<string, (PacketInfo packetInfo, long trafficSize)> entries = new ConcurrentDictionary<string, (PacketInfo packetInfo, long trafficSize)>();
        private static string deviceKey;

        private DataCollector()
        {
            // Set device key
            RegistryKey registryKey = Registry.LocalMachine.OpenSubKey(@"SOFTWARE\CyberscopeAnalyzer");
            deviceKey = registryKey.GetValue("DeviceKey").ToString();

            // Initialize the gRPC client
            var httpHandler = new StandardSocketsHttpHandler();
            var channelOptions = new GrpcChannelOptions
            {
                HttpHandler = httpHandler,
                Credentials = ChannelCredentials.SecureSsl
            };
            var channel = GrpcChannel.ForAddress("https://grpc-cyberscope.rickokkersen.nl", channelOptions);
            logClient = new LogService.LogServiceClient(channel);
        }

        public static DataCollector Instance
        {
            get
            {
                lock (padlock)
                {
                    if (instance == null)
                    {
                        instance = new DataCollector();
                    }
                    return instance;
                }
            }
        }

        public void AddEntry(PacketInfo packetInfo)
        {
            string key = packetInfo.Key;
            entries.AddOrUpdate(key, (packetInfo, packetInfo.Size), (k, v) => (packetInfo, v.trafficSize + packetInfo.Size));
        }

        public async Task SendAggregatedLogsAsync()
        {
            ConcurrentDictionary<string, (PacketInfo packetInfo, long trafficSize)> entriesToSend;

            lock (entries)
            {
                entriesToSend = new ConcurrentDictionary<string, (PacketInfo packetInfo, long trafficSize)>(entries);
                entries.Clear();
            }

            foreach (var entry in entriesToSend)
            {
                //PacketInfo packetInfo = entry.Value.packetInfo;
                //long trafficSize = entry.Value.trafficSize;
                //Console.WriteLine($"Sending aggregated logs for {packetInfo.Key} with size {trafficSize}");
                Console.WriteLine(entry.ToString());

                var request = new LogRequest
                {
                    DeviceId = deviceKey,
                    SourceIp = entry.Value.packetInfo.SourceIp,
                    DestinationIp = entry.Value.packetInfo.DestinationIp,
                    SourcePort = entry.Value.packetInfo.SourcePort,
                    DestinationPort = entry.Value.packetInfo.DestinationPort,
                    Size = (int)entry.Value.trafficSize,
                    Timestamp = entry.Value.packetInfo.Timestamp.ToString(),
                    Type = entry.Value.packetInfo.Type,
                    ProcessId = entry.Value.packetInfo.ProcessDetails?.ProcessId ?? 0,
                    ProcessName = entry.Value.packetInfo.ProcessDetails?.ProcessName ?? "",
                    ExecutablePath = entry.Value.packetInfo.ProcessDetails?.ExecutablePath ?? "",
                    FileHash = entry.Value.packetInfo.ProcessDetails?.FileHash ?? ""
                };

                try
                {
                    var response = await logClient.SendLogAsync(request);
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
}