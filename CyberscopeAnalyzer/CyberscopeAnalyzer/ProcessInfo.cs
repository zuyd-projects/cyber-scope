using CyberscopeAnalyzer.Models;
using System;
using System.Diagnostics;

namespace CyberscopeAnalyzer
{
    public static class ProcessInfo
    {
        public static ProcessDetails GetProcessDetails(string pid, PacketInfo packetInfo)
        {
            try
            {
                ProcessDetails pD = new ProcessDetails();
                pD.ProcessId = int.Parse(pid);
                Process process = Process.GetProcessById(pD.ProcessId);
                pD.ExecutablePath = process.MainModule.FileName;
                pD.ProcessName = process.ProcessName;
                pD.FileHash = SecurityUtils.GetFileHash(pD.ExecutablePath);

                return pD;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error retrieving process information: {ex.Message}");
                return null;
            }
        }
    }
}
