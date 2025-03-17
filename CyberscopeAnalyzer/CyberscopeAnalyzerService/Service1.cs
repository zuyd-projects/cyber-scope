using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Diagnostics;
using System.Linq;
using System.ServiceProcess;
using System.Text;
using System.Threading.Tasks;

namespace CyberscopeAnalyzerService
{
    public partial class Service1 : ServiceBase
    {
        private static readonly NLog.Logger Logger = NLog.LogManager.GetCurrentClassLogger();
        private Process process;
        public Service1()
        {
            InitializeComponent();
        }

        protected override void OnStart(string[] args)
        {
            Logger.Info("Starting Cyberscope Analyzer Service...");

            StartConsoleApp();
        }

        protected override void OnStop()
        {
            Logger.Info("Stopping Cyberscope Analyzer Service...");

            if (process != null && !process.HasExited)
            {
                process.Kill();
                process.Dispose();
            }
        }

        private void StartConsoleApp()
        {
            ProcessStartInfo startInfo = new ProcessStartInfo
            {
                FileName = "CyberscopeAnalyzer.exe",
                WindowStyle = ProcessWindowStyle.Hidden,
                UseShellExecute = false,
                CreateNoWindow = true
            };
        }
    }
}
