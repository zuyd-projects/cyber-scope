namespace CyberscopeAnalyzer.Models
{
    public class ProcessDetails
    {
        public int ProcessId { get; set; }         // Process ID
        public string ProcessName { get; set; }    // Process Name
        public string ExecutablePath { get; set; } // Full path to the executable
        public string FileHash { get; set; }       // SHA-256 hash of the executable

        public override string ToString()
        {
            return $"Process: {ProcessName} (PID: {ProcessId}) " +
                   $"Executable Path: {ExecutablePath} " +
                   $"File Hash: {FileHash}";
        }
    }
}
