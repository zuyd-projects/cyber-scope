export default function WindowsTab() {
  return (
    <section className="space-y-6">
      <header>
        <h2 className="text-3xl font-bold text-primary mb-2">
          🤖 CyberscopeAnalyzer (Windows)
        </h2>
        <p className="text-muted-foreground -mb-2">
          Application written in .NET to analyze outgoing packets from the
          network card and send logs over gRPC.
        </p>
      </header>

      <div className="rounded-xl border bg-card p-6 shadow-md">
        <h3 className="text-xl font-semibold text-primary mb-4">
          🚀 How to install
        </h3>
        <ol className="space-y-3 text-sm text-foreground">
          <li className="flex items-center space-x-2">
            <span className="font-medium">1.</span>
            <div className="mt-0">
              <a
                href="https://github.com/zuyd-projects/cyber-scope/releases/download/ssh-monitor/SetupCyberscopeAnalyzer.msi"
                download="SetupCyberscopeAnalyzer.msi"
                type="application/zip"
                className="w-[200px] h-[50px] inline-flex items-center justify-center gap-2 bg-blue-200 text-black px-4 py-2 rounded-lg text-sm font-bold shadow transition hover:bg-blue-100"
              >
                Download installer
              </a>
            </div>
          </li>
          <li>
            <span className="font-medium">2.</span> Run{" "}
            <code className="text-xs bg-muted px-1 py-0.5 rounded">
              SetupCyberscopeAnalyzer.msi
            </code>{" "}
            and follow the installation steps
          </li>
        </ol>
      </div>

      <div className="rounded-xl border-l-4 border-yellow-500 bg-yellow-50 p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-yellow-800 mb-2">
          ⚠️ Important
        </h3>
        <p className="mt-2 text-sm">
          During the installation process, you will be prompted to install Npcap. The installation window will appear behind the SetupCyberscopeAnalyzer window. The correct settings have been applied already, but you need to click the "Install" button in the Npcap window to proceed with the installation. If you do not see the Npcap window, please check your taskbar or use Alt+Tab to switch to it.
        </p>
      </div>

      <div className="rounded-xl border bg-card p-6 shadow-md">
        <h3 className="text-xl font-semibold text-primary mb-2">
          ❓ What data will be collected?
        </h3>
        <p className="mt-2 text-sm">
          The following data is collected by the CyberscopeAnalyzer:
        </p>
        <ul className="list-disc list-inside space-y-2 mt-2 text-sm">
            <li>Source address (local internal IP address)</li>
            <li>Destination address</li>
            <li>Source port</li>
            <li>Destination port</li>
            <li>Protocol (TCP/UDP)</li>
            <li>Packet size</li>
            <li>Timestamp</li>
            <li>Process ID</li>
            <li>Process name</li>
            <li>Process path</li>
            <li>Process filehash</li>
          </ul>
          <p className="mt-4 text-sm">The package contents will NEVER be collected. The data is sent to the CyberscopeAnalyzer server over gRPC. The server will then store it in a database. 
            The data is stored for 30 days and is available in the dashboard by admin users and users added to the device.</p>
      </div>
    </section>
  );
}