import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-50 font-sans text-zinc-900 dark:bg-black dark:text-zinc-50">
      <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col items-stretch px-6 sm:px-8">
        {/* Hero */}
        <section className="relative flex flex-1 flex-col items-center justify-center gap-6 py-20 text-center sm:py-28">
          <div className="absolute inset-0 -z-10 bg-gradient-to-b from-transparent via-zinc-100 to-transparent dark:via-zinc-900" />
          <h1 className="max-w-4xl text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
            Trade with confidence. Stay compliant everywhere.
          </h1>
          <p className="max-w-3xl text-lg leading-8 text-zinc-700 dark:text-zinc-300">
            zkTrex is an accredited-investor compliant dashboard and asset trading platform.
            We determine what you’re approved to trade based on your country’s accredited
            investor requirements, so you can invest with clarity and compliance.
          </p>
          <div className="flex flex-col items-center gap-3 sm:flex-row">
            <Link
              href="/app"
              className="inline-flex h-12 items-center justify-center rounded-full bg-zinc-900 px-6 text-white transition-colors hover:bg-zinc-800 dark:bg-zinc-50 dark:text-black dark:hover:bg-zinc-200"
            >
              Launch zkTrex
            </Link>
            <Link
              href="/app"
              className="inline-flex h-12 items-center justify-center rounded-full border border-zinc-300 px-6 text-zinc-900 transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-50 dark:hover:bg-zinc-900"
            >
              View Demo Dashboard
            </Link>
          </div>
        </section>

        {/* Compliance Engine */}
        <section className="grid gap-6 border-t border-zinc-200 py-16 dark:border-zinc-800 md:grid-cols-2">
          <div className="flex flex-col gap-4">
            <h2 className="text-2xl font-semibold tracking-tight">Compliance Engine</h2>
            <p className="text-zinc-700 dark:text-zinc-300">
              Our rules engine maps each asset to the jurisdictions where it can be offered to
              accredited investors. Provide your residency and accreditation details once; we’ll
              filter your asset universe automatically, in real time.
            </p>
            <ul className="list-inside list-disc text-zinc-700 dark:text-zinc-300">
              <li>Jurisdiction-aware asset availability</li>
              <li>Continuous eligibility checks</li>
              <li>Audit-ready decision trail</li>
            </ul>
            <div>
              <Link
                href="/app"
                className="inline-flex rounded-full bg-zinc-900 px-5 py-2.5 text-sm text-white hover:bg-zinc-800 dark:bg-zinc-50 dark:text-black dark:hover:bg-zinc-200"
              >
                Try the Compliance Check
              </Link>
            </div>
          </div>
          <div className="rounded-2xl border border-zinc-200 p-6 dark:border-zinc-800">
            <div className="grid grid-cols-3 gap-3 text-sm">
              <div className="rounded-lg bg-zinc-100 p-4 dark:bg-zinc-900">
                <p className="font-medium">Country</p>
                <p className="text-zinc-600 dark:text-zinc-400">United States</p>
              </div>
              <div className="rounded-lg bg-zinc-100 p-4 dark:bg-zinc-900">
                <p className="font-medium">Status</p>
                <p className="text-green-600">Accredited</p>
              </div>
              <div className="rounded-lg bg-zinc-100 p-4 dark:bg-zinc-900">
                <p className="font-medium">Eligible Assets</p>
                <p className="text-zinc-600 dark:text-zinc-400">43</p>
              </div>
            </div>
            <div className="mt-4 rounded-lg bg-gradient-to-r from-emerald-500/10 to-indigo-500/10 p-4 text-sm">
              Mapped to Reg D 506(c), Reg S, and local exemptions as applicable.
            </div>
          </div>
        </section>

        {/* Investor Profile */}
        <section className="grid gap-6 border-t border-zinc-200 py-16 dark:border-zinc-800 md:grid-cols-2">
          <div className="order-2 md:order-1 rounded-2xl border border-zinc-200 p-6 dark:border-zinc-800">
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between rounded-lg bg-zinc-100 p-4 dark:bg-zinc-900">
                <span className="font-medium">Identity Verified</span>
                <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-emerald-600">Yes</span>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-zinc-100 p-4 dark:bg-zinc-900">
                <span className="font-medium">Accreditation Proof</span>
                <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-emerald-600">Valid</span>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-zinc-100 p-4 dark:bg-zinc-900">
                <span className="font-medium">Jurisdiction</span>
                <span className="text-zinc-600 dark:text-zinc-400">EU (Germany)</span>
              </div>
            </div>
          </div>
          <div className="order-1 md:order-2 flex flex-col gap-4">
            <h2 className="text-2xl font-semibold tracking-tight">Investor Profile</h2>
            <p className="text-zinc-700 dark:text-zinc-300">
              Build your compliant investor profile in minutes. Connect documents securely and
              keep them private with zero-knowledge verification options where supported.
            </p>
            <ul className="list-inside list-disc text-zinc-700 dark:text-zinc-300">
              <li>One-time onboarding with secure storage</li>
              <li>Zero-knowledge proofs for selective disclosure</li>
              <li>Auto-refresh on document expiry</li>
            </ul>
            <div>
              <Link
                href="/app"
                className="inline-flex rounded-full border border-zinc-300 px-5 py-2.5 text-sm hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-900"
              >
                Create Your Profile
              </Link>
            </div>
          </div>
        </section>

        {/* Asset Universe */}
        <section className="grid gap-6 border-t border-zinc-200 py-16 dark:border-zinc-800 md:grid-cols-2">
          <div className="flex flex-col gap-4">
            <h2 className="text-2xl font-semibold tracking-tight">Curated Asset Universe</h2>
            <p className="text-zinc-700 dark:text-zinc-300">
              Browse tokenized equities, funds, credit, real-world assets, and digital-native
              instruments — filtered automatically to what you can legally access.
            </p>
            <ul className="list-inside list-disc text-zinc-700 dark:text-zinc-300">
              <li>Issuer disclosures and risk summaries</li>
              <li>Jurisdictional availability badges</li>
              <li>Fee transparency and liquidity indicators</li>
            </ul>
            <div>
              <Link
                href="/app"
                className="inline-flex rounded-full bg-indigo-600 px-5 py-2.5 text-sm text-white hover:bg-indigo-500"
              >
                Explore Eligible Assets
              </Link>
            </div>
          </div>
          <div className="rounded-2xl border border-zinc-200 p-6 dark:border-zinc-800">
            <div className="space-y-3 text-sm">
              {[
                { name: "Tokenized Fund A", region: "US/EU", status: "Eligible" },
                { name: "Credit Note B", region: "US Only", status: "Eligible" },
                { name: "RWA Equity C", region: "EU", status: "Restricted" },
              ].map((a) => (
                <div key={a.name} className="flex items-center justify-between rounded-lg bg-zinc-100 p-4 dark:bg-zinc-900">
                  <div>
                    <p className="font-medium">{a.name}</p>
                    <p className="text-xs text-zinc-600 dark:text-zinc-400">Region: {a.region}</p>
                  </div>
                  <span className={`rounded-full px-3 py-1 text-xs ${a.status === "Eligible" ? "bg-emerald-500/10 text-emerald-600" : "bg-amber-500/10 text-amber-600"}`}>
                    {a.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Trading Experience */}
        <section className="grid gap-6 border-t border-zinc-200 py-16 dark:border-zinc-800 md:grid-cols-2">
          <div className="order-2 md:order-1 rounded-2xl border border-zinc-200 p-6 dark:border-zinc-800">
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="rounded-lg bg-zinc-100 p-4 dark:bg-zinc-900">
                <p className="font-medium">Instant Checks</p>
                <p className="text-zinc-600 dark:text-zinc-400">Eligibility at order submit</p>
              </div>
              <div className="rounded-lg bg-zinc-100 p-4 dark:bg-zinc-900">
                <p className="font-medium">Settlement</p>
                <p className="text-zinc-600 dark:text-zinc-400">On-chain or off-chain rails</p>
              </div>
              <div className="rounded-lg bg-zinc-100 p-4 dark:bg-zinc-900">
                <p className="font-medium">Custody</p>
                <p className="text-zinc-600 dark:text-zinc-400">Self or qualified</p>
              </div>
              <div className="rounded-lg bg-zinc-100 p-4 dark:bg-zinc-900">
                <p className="font-medium">Reporting</p>
                <p className="text-zinc-600 dark:text-zinc-400">Tax + compliance exports</p>
              </div>
            </div>
          </div>
          <div className="order-1 md:order-2 flex flex-col gap-4">
            <h2 className="text-2xl font-semibold tracking-tight">Trade with Confidence</h2>
            <p className="text-zinc-700 dark:text-zinc-300">
              When you place an order, zkTrex verifies compliance in the background, so your
              trades remain aligned with securities laws in your jurisdiction.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/app" className="inline-flex rounded-full bg-emerald-600 px-5 py-2.5 text-sm text-white hover:bg-emerald-500">
                Start Trading
              </Link>
              <Link href="/app" className="inline-flex rounded-full border border-zinc-300 px-5 py-2.5 text-sm hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-900">
                See Order Flow
              </Link>
            </div>
          </div>
        </section>

        {/* Trust & Security */}
        <section className="grid gap-6 border-t border-zinc-200 py-16 dark:border-zinc-800 md:grid-cols-3">
          <div className="flex flex-col gap-2">
            <h3 className="text-lg font-semibold">Privacy by Design</h3>
            <p className="text-sm text-zinc-700 dark:text-zinc-300">
              Zero-knowledge options for proving accreditation without revealing sensitive data.
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <h3 className="text-lg font-semibold">Institutional Security</h3>
            <p className="text-sm text-zinc-700 dark:text-zinc-300">
              Encryption in transit and at rest, with configurable custody integrations.
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <h3 className="text-lg font-semibold">Transparent Controls</h3>
            <p className="text-sm text-zinc-700 dark:text-zinc-300">
              Clear audit logs, access controls, and exportable compliance reports.
            </p>
          </div>
          <div className="md:col-span-3 mt-4">
            <Link
              href="/app"
              className="inline-flex w-full items-center justify-center rounded-full bg-zinc-900 px-6 py-3 text-white hover:bg-zinc-800 dark:bg-zinc-50 dark:text-black dark:hover:bg-zinc-200"
            >
              Go to App
            </Link>
          </div>
        </section>

        {/* Final CTA */}
        <section className="border-t border-zinc-200 py-16 text-center dark:border-zinc-800">
          <h2 className="text-3xl font-semibold tracking-tight">Your compliant gateway to global assets</h2>
          <p className="mx-auto mt-3 max-w-2xl text-zinc-700 dark:text-zinc-300">
            Get the clarity you need to participate confidently in private markets and
            tokenized assets — with eligibility checks built in.
          </p>
          <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link href="/app" className="inline-flex h-12 items-center justify-center rounded-full bg-indigo-600 px-6 text-white hover:bg-indigo-500">
              Get Started
            </Link>
            <Link href="/app" className="inline-flex h-12 items-center justify-center rounded-full border border-zinc-300 px-6 hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-900">
              Continue to Dashboard
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
