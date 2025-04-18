"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@cyberscope/components/ui/card";

export function PolicyForm() {
  return (
    <div className="flex justify-center">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl text-center">Privacy Policy</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 text-sm leading-6 text-muted-foreground w-[750px]">
          <section className="mb-4">
            <h3 className="text-lg font-bold flex items-center gap-2 mb-2">
              Who are we?
            </h3>
            <p>
              We are the development team of CyberScope, a project aimed at
              detecting malicious network traffic on Windows and Linux systems.
              Your privacy is important to us. This policy explains what
              personal data we collect, why we collect it, and how we protect
              it.
            </p>
          </section>

          <section className="mb-4">
            <h3 className="text-lg font-bold flex items-center gap-2 mb-2">
              What personal data do we collect?
            </h3>
            <p>We only collect the following personal information:</p>
            <ul className="list-disc pl-5 mb-2">
              <li>Full name</li>
              <li>Email address</li>
              <li>
                Password (securely stored using bcrypt encryption with a work
                factor of 12)
              </li>
            </ul>
            <p>Additionally, our system logs:</p>
            <ul className="list-disc pl-5 mb-2">
              <li>
                IP addresses (source and destination) involved in network
                activity
              </li>
              <li>Device identifiers linked to specific machines</li>
              <li>
                Timestamped connection metadata (such as port numbers,
                protocols, and action types)
              </li>
            </ul>
            <p>
              These data points are not linked to your name or any other
              directly identifying information, unless you are assigned to a
              device by an administrator.
            </p>
          </section>

          <section className="mb-4">
            <h3 className="text-lg font-bold flex items-center gap-2 mb-2">
              Why do we collect this data?
            </h3>
            <p>We collect and process your data to:</p>
            <ul className="list-disc pl-5 mb-2">
              <li>Authenticate users securely</li>
              <li>
                Distinguish access rights between administrators and regular
                users
              </li>
              <li>
                Monitor and analyze outgoing network traffic to detect threats
              </li>
              <li>Provide visual insights via dashboards</li>
              <li>
                Help protect systems from unauthorized access and data theft
              </li>
            </ul>
            <p>
              We do not use your data for advertising or profiling, and we do
              not sell or share your data with third parties.
            </p>
          </section>

          <section className="mb-4">
            <h3 className="text-lg font-bold flex items-center gap-2 mb-2">
              How do we protect your data?
            </h3>
            <p>
              We implement multiple technical and organizational measures to
              secure your data:
            </p>
            <ul className="list-disc pl-5 mb-2">
              <li>Passwords are encrypted using bcrypt (12 work factor)</li>
              <li>
                Role-based access control (RBAC) limits who can see which data
              </li>
              <li>All communications are encrypted with SSL/TLS</li>
              <li>
                All services run in segmented environments using Kubernetes to
                limit access
              </li>
              <li>
                Sensitive data is stored locally, not in the cloud, and never
                shared without your consent
              </li>
              <li>
                We conduct automatic vulnerability scanning of our codebase
              </li>
            </ul>
          </section>

          <section className="mb-4">
            <h3 className="text-lg font-bold flex items-center gap-2 mb-2">
              Data retention
            </h3>
            <p>
              All collected data is stored for a maximum of 30 days, after which
              it is automatically deleted or archived. This retention period
              ensures a balance between operational needs and your privacy
              rights.
            </p>
          </section>

          <section className="mb-4">
            <h3 className="text-lg font-bold flex items-center gap-2 mb-2">
              Your rights
            </h3>
            <p>
              Under the General Data Protection Regulation (GDPR), you have the
              right to:
            </p>
            <ul className="list-disc pl-5 mb-2">
              <li>Access your personal data</li>
              <li>Request correction or deletion of your data</li>
              <li>Object to the processing of your data</li>
              <li>Withdraw your consent at any time</li>
            </ul>
          </section>

          <section className="mb-4">
            <h3 className="text-lg font-bold flex items-center gap-2 mb-2">
              Cookies
            </h3>
            <p>
              Our application does not use tracking cookies or third-party
              analytics services. Only essential session cookies may be used to
              maintain login status.
            </p>
          </section>

          <section className="mb-4">
            <h3 className="text-lg font-bold flex items-center gap-2 mb-2">
              Changes to this policy
            </h3>
            <p>
              We may update this Privacy Policy if our application evolves. If
              significant changes are made, we will notify users before they
              take effect.
            </p>
          </section>
        </CardContent>
      </Card>
    </div>
  );
}
