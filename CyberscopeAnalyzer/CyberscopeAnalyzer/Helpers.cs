using Grpc.Core;
using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.NetworkInformation;
using System.Text;
using System.Threading.Tasks;

namespace CyberscopeAnalyzer
{
    internal class Helpers
    {

        public static List<string> GetLocalInterfaceIPs()
        {
            return NetworkInterface.GetAllNetworkInterfaces().SelectMany(n => n.GetIPProperties().UnicastAddresses).Select(a => a.Address.ToString()).ToList();
        }

        public static bool IsLocalIp(string ip)
        {
            return ip.StartsWith("10.") ||
                   ip.StartsWith("192.168.") ||
                   ip.StartsWith("172.16.") ||
                   ip.StartsWith("172.17.") ||
                   ip.StartsWith("172.18.") ||
                   ip.StartsWith("172.19.") ||
                   ip.StartsWith("172.20.") ||
                   ip.StartsWith("172.21.") ||
                   ip.StartsWith("172.22.") ||
                   ip.StartsWith("172.23.") ||
                   ip.StartsWith("172.24.") ||
                   ip.StartsWith("172.25.") ||
                   ip.StartsWith("172.26.") ||
                   ip.StartsWith("172.27.") ||
                   ip.StartsWith("172.28.") ||
                   ip.StartsWith("172.29.") ||
                   ip.StartsWith("172.30.") ||
                   ip.StartsWith("172.31.") ||
                   ip == "127.0.0.1";
        }
    }
}
