export default function SSHTab() {
  return (
    <section className="space-y-6">
      <header>
        <h2 className="text-3xl font-bold text-primary mb-2">
          🚀 SSH Log Monitor Setup
        </h2>
        <p className="text-muted-foreground -mb-2">
          Lightweight Go app to monitor SSH login attempts via{" "}
          <code className="bg-muted px-1 py-0.5 rounded text-xs">
            /var/log/auth.log
          </code>{" "}
          and send logs over gRPC.
        </p>
      </header>

      <div className="rounded-xl border border-primary/20 bg-gradient-to-br from-primary/5 to-background p-6 shadow-md">
        <h3 className="text-xl font-semibold text-primary mb-2">
          ⚡ Quick One-Line Install
        </h3>
        <p className="text-sm mb-4 text-muted-foreground">
          Set up the monitor, cron job, and log tracking in one command:
        </p>
        <pre className="bg-background border border-primary/20 rounded-md p-4 text-sm overflow-x-auto text-primary">
          curl -sSL
          https://raw.githubusercontent.com/zuyd-projects/cyber-scope/main/ssh-log-monitor/install.sh
          | sudo bash
        </pre>
        <ul className="list-disc pl-6 mt-4 text-sm text-muted-foreground space-y-1">
          <li>
            Binary →{" "}
            <code className="bg-muted px-1 py-0.5 rounded text-xs">
              /usr/local/bin/ssh-monitor
            </code>
          </li>
          <li>Cron job → Every minute</li>
          <li>
            Logs →{" "}
            <code className="bg-muted px-1 py-0.5 rounded text-xs">
              /var/log/ssh-monitor.log
            </code>
          </li>
          <li>
            Offset →{" "}
            <code className="bg-muted px-1 py-0.5 rounded text-xs">
              /var/lib/ssh-monitor/offset.txt
            </code>
          </li>
        </ul>
      </div>

      <div className="rounded-xl border-l-4 border-green-600 bg-green-50 p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-green-700 mb-2">
          ✅ Built-in Reliability
        </h3>
        <ul className="list-disc pl-6 text-sm text-green-800 space-y-1">
          <li>🕒 Auto timeout after 1 minute</li>
          <li>🧠 Offset tracking prevents duplication</li>
          <li>🔒 Lock file avoids concurrent runs</li>
          <li>📈 Performance & error logs included</li>
        </ul>
      </div>

      <div className="rounded-xl border bg-card p-6 shadow-md">
        <h3 className="text-xl font-semibold text-primary mb-4">
          🛠 Manual Installation (For Developers)
        </h3>
        <ol className="space-y-4 text-sm text-foreground">
          <li>
            <strong>Clone the repo:</strong>{" "}
            <code className="bg-muted px-2 py-0.5 rounded">
              git clone https://github.com/zuyd-projects/cyber-scope.git
            </code>
          </li>
          <li>
            <strong>Install dependencies:</strong>{" "}
            <code className="bg-muted px-2 py-0.5 rounded">go mod tidy</code>
          </li>
          <li>
            <strong>Generate gRPC files:</strong>{" "}
            <code className="bg-muted px-2 py-0.5 rounded">
              protoc --go_out=paths=source_relative:.
              --go-grpc_out=paths=source_relative:. proto/cyberscope.proto
            </code>
          </li>
          <li>
            <strong>Build binary:</strong>{" "}
            <code className="bg-muted px-2 py-0.5 rounded">
              GOOS=linux GOARCH=amd64 go build -o ssh-monitor
            </code>
          </li>
          <li>
            <strong>Transfer binary:</strong>{" "}
            <code className="bg-muted px-2 py-0.5 rounded">
              scp ssh-monitor user@host:/path
            </code>
          </li>
        </ol>
      </div>

      <div className="rounded-xl border bg-card p-6 shadow-md">
        <h3 className="text-xl font-semibold text-primary mb-2">
          🔧 Run & View Logs
        </h3>
        <div className="space-y-3 text-sm">
          <div>
            <p className="text-muted-foreground">Run the monitor manually:</p>
            <pre className="bg-muted rounded-md p-3 overflow-x-auto text-muted-foreground">
              sudo ./ssh-monitor
            </pre>
          </div>
          <div>
            <p className="text-muted-foreground">Live tail the logs:</p>
            <pre className="bg-muted rounded-md p-3 overflow-x-auto text-muted-foreground">
              tail -f /var/log/ssh-monitor.log
            </pre>
          </div>
        </div>
      </div>
    </section>
  );
}