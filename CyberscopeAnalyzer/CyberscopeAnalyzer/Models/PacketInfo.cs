using System;

namespace CyberscopeAnalyzer.Models
{
    public class PacketInfo
    {
        public string SourceIp { get; set; }
        public string DestinationIp { get; set; }
        public int SourcePort { get; set; }
        public int DestinationPort { get; set; }
        public int Size { get; set; }
        public DateTime Timestamp { get; set; }
        public PacketType Type { get; set; }

        public ProcessDetails ProcessDetails { get; set; }
        public string Key => $"{SourceIp}:{SourcePort} -> {DestinationIp}:{DestinationPort}";

        public override string ToString()
        {
            string value = $"{Timestamp}: <{Type}> {SourceIp}:{SourcePort} -> {DestinationIp}:{DestinationPort}";
            
            if (ProcessDetails != null)
            {
                value += $" [{ProcessDetails.ToString()}]";
            }

            return value;
        }
    }
}
