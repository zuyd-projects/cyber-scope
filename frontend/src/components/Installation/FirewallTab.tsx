export default function FirewallTab() {
  return (
    <section className="space-y-6">
      <header>
        <h2 className="text-3xl font-bold text-primary mb-2">
          🔐 Windows Firewall IP Monitor
        </h2>
        <p className="text-muted-foreground -mb-2">
          A PowerShell-based collector that monitors real-time firewall logs,
          classifies IPs, and logs activity with timestamps and hostnames.
        </p>
      </header>

      <div className="rounded-xl border border-primary/20 bg-gradient-to-br from-blue-50 to-background p-6 shadow-md">
        <h3 className="text-xl font-semibold text-primary mb-2">
          ⚙️ What It Does
        </h3>
        <ul className="list-disc pl-6 space-y-1 text-sm text-muted-foreground">
          <li>Enables Windows Firewall logging (DROP and ALLOW)</li>
          <li>
            Automatically retrieves firewall entries from{" "}
            <code className="bg-muted px-1 py-0.5 rounded text-xs">
              pfirewall.log
            </code>
          </li>
          <li>Sends results to Cyberscope servers for processing</li>
        </ul>
      </div>

      <div className="rounded-xl border bg-card p-6 shadow-md">
        <h3 className="text-xl font-semibold text-primary mb-4">
          🚀 How to install
        </h3>
        <ol className="space-y-3 text-sm text-foreground">
          <li className="flex items-center space-x-2">
            <span className="font-medium">1.</span>
            <div className="mt-0">
              <a
                href="https://github.com/zuyd-projects/cyber-scope/releases/download/ssh-monitor/CyberscopeFirewallAnalyzer.zip"
                download="CyberscopeFirewallAnalyzer.zip"
                type="application/zip"
                className="w-[200px] h-[50px] inline-flex items-center justify-center gap-2 bg-blue-200 text-black px-4 py-2 rounded-lg text-sm font-bold shadow transition hover:bg-blue-100"
              >
                Download ZIP
              </a>
            </div>
          </li>
          <li>
            <span className="font-medium">2.</span> Extract the ZIP file
          </li>
          <li>
            <span className="font-medium">3.</span> Open the extracted folder
          </li>
          <li>
            <span className="font-medium">4.</span> Run the{" "}
            <code className="text-xs bg-muted px-1 py-0.5 rounded">
              install.bat
            </code>{" "}
            file as administrator The program will install in the following
            directory:
            <code className="text-xs bg-muted px-1 py-0.5 rounded">
              C:\Program Files\Cyberscope\FirewallCollector
            </code>
          </li>
        </ol>
      </div>

      <div className="rounded-xl border bg-card p-6 shadow-md">
        <h3 className="text-xl font-semibold text-primary mb-2">
          ❓ Why administrator privileges?
        </h3>
        <p className="mt-2 text-sm">
          This script requires elevated permissions to modify firewall settings
          and install the collector script as a service.
        </p>
      </div>

      <div className="rounded-xl border-l-4 border-yellow-500 bg-yellow-50 p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-yellow-800 mb-2">
          ⚠️ Important
        </h3>
        <p className="mt-2 text-sm">
          This script will NOT collect any personal data. It only contains
          logging of the connections (IP-addresses) made (ACCEPTED) or attempted
          (BLOCKED) to your computer. It will not log your IP address
        </p>
      </div>

      <div className="rounded-xl border-l-4 border-indigo-600 bg-indigo-50 p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-indigo-800 mb-2">
          🔧 Service Details
        </h3>
        <ul className="list-disc pl-6 text-sm text-indigo-800 space-y-1">
          <li>
            Uses{" "}
            <code className="bg-muted px-1 py-0.5 rounded text-xs">
              nssm.exe
            </code>{" "}
            to manage the service
          </li>
          <li>
            Service name:{" "}
            <code className="bg-muted px-1 py-0.5 rounded text-xs">
              CyberscopeFirewallCollector
            </code>
          </li>
          <li>
            Uses{" "}
            <code className="bg-muted px-1 py-0.5 rounded text-xs">
              GrpcClient.exe
            </code>{" "}
            to send data to the Cyberscope server
          </li>
          <li>
            Ensure{" "}
            <code className="bg-muted px-1 py-0.5 rounded text-xs">
              run.ps1
            </code>{" "}
            and{" "}
            <code className="bg-muted px-1 py-0.5 rounded text-xs">
              GrpcClient.exe
            </code>{" "}
            are in the same directory
          </li>
        </ul>
      </div>
    </section>
  );
}