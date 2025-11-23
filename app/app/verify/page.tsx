"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import SelfVerification from "@/src/components/SelfVerification"

export default function VerifyPage() {
  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-semibold tracking-tight">Verify</h1>
      <p className="mt-4 text-muted-foreground max-w-2xl">
        Use Self on Celo to generate a zero-knowledge proof of your identity
        attributes. This lets you privately prove your residency and which
        assets you’re permitted to interact with — without revealing sensitive
        personal information.
      </p>

      {/* Verification flow entry: opens shadcn/ui Dialog with Self verification */}
      <section className="mt-8 rounded-lg border p-6">
        <h2 className="text-xl font-medium">Get started</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Connect your account and follow the steps to create your ZK proof.
          Once verified, eligible features across the app will recognize your
          residency status and permitted asset set.
        </p>

        <div className="mt-4">
          <Dialog>
            <DialogTrigger asChild>
              <button
                type="button"
                className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-ring"
              >
                Start verification
              </button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-xl">
              <DialogHeader>
                <DialogTitle>Verify your identity with Self</DialogTitle>
                <DialogDescription>
                  Scan the QR code with the Self app to create a private ZK proof
                  of your residency and eligible assets.
                </DialogDescription>
              </DialogHeader>
              <div className="mt-2">
                <SelfVerification />
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </section>
    </main>
  )
}
