using PacketDotNet;
using PacketDotNet.Ieee80211;
using SharpPcap;
using System;
using System.Collections.Generic;
using CyberscopeAnalyzer.Models;

namespace CyberscopeAnalyzer
{
    internal class PacketCaptureHandler
    {
        private readonly List<ICaptureDevice> devices = new List<ICaptureDevice>();
        private List<string> localInterfaceIps;

        public void StartCapture()
        {
            var deviceList = CaptureDeviceList.Instance;

            if (deviceList.Count < 1)
            {
                Console.WriteLine("No devices found!");
                return;
            }

            localInterfaceIps = Helpers.GetLocalInterfaceIPs();

            foreach (var device in deviceList)
            {
                device.Open(DeviceModes.Promiscuous, 1000);
                device.OnPacketArrival += new PacketArrivalEventHandler(OnPacketArrival);
                device.StartCapture();
                devices.Add(device);
            }
        }

        public void StopCapture()
        {
            foreach (var device in devices)
            {
                device.StopCapture();
                device.Close();
            }
        }

        private void OnPacketArrival(object sender, PacketCapture e)
        {
            var rawPacket = e.GetPacket();
            var packet = Packet.ParsePacket(rawPacket.LinkLayerType, rawPacket.Data);
            

            if (packet is EthernetPacket ethernetPacket && ethernetPacket.PayloadPacket is IPPacket ipPacket)
            {
                if (!localInterfaceIps.Contains(ipPacket.SourceAddress.ToString()) || Helpers.IsLocalIp(ipPacket.DestinationAddress.ToString()))
                {
                    return;
                }
                var packetInfo = new PacketInfo
                {
                    SourceIp = ipPacket.SourceAddress.ToString(),
                    DestinationIp = ipPacket.DestinationAddress.ToString(),
                    Timestamp = DateTime.UtcNow
                };

                if (ipPacket.PayloadPacket is TcpPacket tcpPacket)
                {

                    packetInfo.SourcePort = tcpPacket.SourcePort;
                    packetInfo.DestinationPort = tcpPacket.DestinationPort;
                    packetInfo.Type = PacketType.Tcp;
                    packetInfo.Size = tcpPacket.PayloadData.Length;


                }
                else if (ipPacket.PayloadPacket is UdpPacket udpPacket)
                {
                    packetInfo.SourcePort = udpPacket.SourcePort;
                    packetInfo.DestinationPort = udpPacket.DestinationPort;
                    packetInfo.Type = PacketType.Udp;
                    packetInfo.Size = udpPacket.PayloadData.Length;
                } 
                else
                {
                    Console.WriteLine("Unknown packet type");
                    return;
                }

                packetInfo.ProcessDetails = NetstatAnalyzer.IdentifyProcess(packetInfo);

                if (packetInfo.ProcessDetails != null && packetInfo.ProcessDetails.ProcessName == "CyberscopeAnalyzer")
                {
                    return;
                }

                DataCollector.Instance.AddEntry(packetInfo);
            }
        }
    }
}
