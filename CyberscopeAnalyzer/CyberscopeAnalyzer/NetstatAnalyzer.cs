using System;
using System.Diagnostics;
using System.IO;
using System.Linq;
using CyberscopeAnalyzer.Models;

namespace CyberscopeAnalyzer
{
    public static class NetstatAnalyzer
    {
        public static ProcessDetails IdentifyProcess(PacketInfo packetInfo)
        {
            ProcessStartInfo processStartInfo = new ProcessStartInfo("netstat", "-ano")
            {
                RedirectStandardOutput = true,
                UseShellExecute = false,
                CreateNoWindow = true
            };

            using (Process process = Process.Start(processStartInfo))
            using (StreamReader reader = process.StandardOutput)
            {
                string output = reader.ReadToEnd();
                var lines = output.Split(new[] { Environment.NewLine }, StringSplitOptions.RemoveEmptyEntries);

                foreach (var line in lines)
                {
                    if (line.Contains($"{packetInfo.SourceIp}:{packetInfo.SourcePort}") && line.Contains($"{packetInfo.DestinationIp}:{packetInfo.DestinationPort}"))
                    {
                        var parts = line.Split(new[] { ' ' }, StringSplitOptions.RemoveEmptyEntries);
                        var pid = parts.Last();

                        return ProcessInfo.GetProcessDetails(pid, packetInfo);
                    }
                }
            }
            return null;
        }
    }
}
