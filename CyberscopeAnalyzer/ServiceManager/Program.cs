using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ServiceManager
{
    internal class Program
    {
        static int Main(string[] args)
        {
            if (args.Length == 0)
            {
                Console.WriteLine("Usage: ServiceHelper.exe /install or /uninstall");
                return 1;
            }

            string action = args[0].ToLowerInvariant();
            string installDir = AppDomain.CurrentDomain.BaseDirectory;
            // Remove the trailing \ from the installDir
            if (installDir.EndsWith(Path.DirectorySeparatorChar.ToString()))
            {
                installDir = installDir.Substring(0, installDir.Length - 1);
            }
            string nssmPath = Path.Combine(installDir, "nssm.exe");
            string serviceName = "CyberscopeAnalyzer";
            string serviceExe = Path.Combine(installDir, "CyberscopeAnalyzer.exe");

            try
            {
                if (!File.Exists(nssmPath))
                {
                    Console.WriteLine("nssm.exe not found.");
                    return 1;
                }

                switch (action)
                {
                    case "/install":
                        if (!File.Exists(serviceExe))
                        {
                            Console.WriteLine("Service EXE not found.");
                            return 1;
                        }

                        Console.WriteLine("Installing service...");
                        RunProcess(nssmPath, $"install {serviceName} CyberscopeAnalyzer.exe");
                        RunProcess(nssmPath, $"set {serviceName} Start SERVICE_AUTO_START");
                        return RunProcess(nssmPath, $"set {serviceName} AppDirectory \"{installDir}\"");

                    case "/start":
                        Console.WriteLine("Starting service...");
                        return RunProcess(nssmPath, $"start {serviceName}");

                    case "/stop":
                        Console.WriteLine("Stopping service...");
                        return RunProcess(nssmPath, $"stop {serviceName}");

                    case "/uninstall":
                        Console.WriteLine("Uninstalling service...");
                        RunProcess(nssmPath, $"stop {serviceName} confirm");
                        return RunProcess(nssmPath, $"remove {serviceName} confirm");

                    default:
                        Console.WriteLine("Unknown command.");
                        return 1;
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error: {ex.Message}");
                return 1;
            }
        }

        static int RunProcess(string fileName, string arguments)
        {
            var psi = new ProcessStartInfo
            {
                FileName = fileName,
                Arguments = arguments,
                UseShellExecute = false,
                CreateNoWindow = true,
                RedirectStandardOutput = true,
                RedirectStandardError = true
            };

            using (var process = Process.Start(psi))
            {
                process.WaitForExit();

                Console.WriteLine(process.StandardOutput.ReadToEnd());
                Console.Error.WriteLine(process.StandardError.ReadToEnd());

                return process.ExitCode;
            }
        }
    }
}
