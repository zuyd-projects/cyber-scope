using System;
using System.Diagnostics;
using System.Linq;
using System.Net.NetworkInformation;
using System.Threading.Tasks;
using PacketDotNet;
using SharpPcap;
using System.Collections.Generic;
using Grpc.Core;
using Grpc.Net.Client;
using System.Net.Http;
using System.IO;
using System.Timers;
using System.Collections.Concurrent;
using Microsoft.Win32;

namespace CyberscopeAnalyzer
{
    internal class Program
    {
        private static readonly NLog.Logger Logger = NLog.LogManager.GetCurrentClassLogger();
        static void Main(string[] args)
        {
            Console.WriteLine(Logger.IsErrorEnabled);

            Console.WriteLine("Starting Network Traffic Analyzer...");
            PacketCaptureHandler packetHandler = new PacketCaptureHandler();
            packetHandler.StartCapture();

            var sendTimer = new Timer(1000);
            sendTimer.Elapsed += async (sender, e) => await DataCollector.Instance.SendAggregatedLogsAsync();
            sendTimer.Start();

            Console.WriteLine("Press Enter to stop capturing...");
            Console.ReadLine();

            packetHandler.StopCapture();

            sendTimer.Stop();
            sendTimer.Dispose();

            DataCollector.Instance.SendAggregatedLogsAsync().Wait();

            Console.WriteLine("Network Traffic Analyzer stopped.");
        }
    }
}
