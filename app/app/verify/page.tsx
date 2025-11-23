"use client"

import React from "react"
import { ethers } from "ethers"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import SelfVerification from "@/src/components/SelfVerification"
import { usePrivy } from "@privy-io/react-auth"

const VERIFIED_KEY = "zkrex_identity_verified"

export default function VerifyPage() {
  const [open, setOpen] = React.useState(false)
  const [isVerified, setIsVerified] = React.useState(false)
  const [checkingOnChain, setCheckingOnChain] = React.useState(false)
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null)
  const { user } = usePrivy()
  const userAddress = user?.wallet?.address

  // On load, check localStorage before asking the user to verify
  React.useEffect(() => {
    try {
      const raw = typeof window !== "undefined" ? localStorage.getItem(VERIFIED_KEY) : null
      const parsed = raw ? JSON.parse(raw) : null
      setIsVerified(!!parsed?.verified)
    } catch (e) {
      setIsVerified(false)
    }
  }, [])

  const writeLocalVerified = React.useCallback(
    (addr?: string | null) => {
      try {
        const value = {
          verified: true,
          at: new Date().toISOString(),
          userId: addr ?? null,
        }
        localStorage.setItem(VERIFIED_KEY, JSON.stringify(value))
      } catch (e) {
        // best-effort only
        console.warn("Failed to write verification status to localStorage", e)
      }
    },
    []
  )

  const handleStartVerification = async () => {
    setErrorMsg(null)
    // If already locally verified, do nothing (button shouldn't be visible in that case).
    if (isVerified) return

    // If we don't have a user address yet, we can't pre-check on-chain. Open dialog.
    if (!userAddress) {
      setOpen(true)
      return
    }

    // Pre-check on-chain `_verified(address)` mapping
    setCheckingOnChain(true)
    try {
      const contractAddress = process.env.NEXT_PUBLIC_ZK_ENDPOINT // expected to be the contract address per requirement
      // Basic guard
      if (!contractAddress || !/^0x[0-9a-fA-F]{40}$/.test(contractAddress)) {
        console.warn("NEXT_PUBLIC_ZK_ENDPOINT is not a contract address; opening dialog fallback.")
        setOpen(true)
        return
      }

      const rpcUrl = process.env.NEXT_PUBLIC_CELO_RPC || "https://forno.celo-sepolia.celo-testnet.org"
      const provider = new ethers.JsonRpcProvider(rpcUrl)
      // Minimal ABI for public mapping getter `_verified(address) -> bool`
      const abi = [
        {
          inputs: [{ internalType: "address", name: "", type: "address" }],
          name: "_verified",
          outputs: [{ internalType: "bool", name: "", type: "bool" }],
          stateMutability: "view",
          type: "function",
        },
      ] as const
      const contract = new ethers.Contract(contractAddress, abi, provider)
      const onChainVerified: boolean = await contract._verified(userAddress)

      if (onChainVerified) {
        // Store locally and bypass the QR flow entirely
        writeLocalVerified(userAddress)
        setIsVerified(true)
        setOpen(false)
      } else {
        // Not verified on-chain; proceed with the normal flow
        setOpen(true)
      }
    } catch (err) {
      console.error("Failed on-chain _verified pre-check; falling back to dialog.", err)
      setErrorMsg(null) // we silently fall back to dialog
      setOpen(true)
    } finally {
      setCheckingOnChain(false)
    }
  }

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

        {/* Show verified confirmation on the page, and hide the start button when already verified */}
        {isVerified ? (
          <div className="mt-4 rounded-md border border-green-600/30 bg-green-600/10 p-3 text-sm">
            <p className="font-medium text-green-700 dark:text-green-400">You have been verified.</p>
            <p className="text-green-700/90 dark:text-green-300/90 mt-1">Your verification status is saved on this device.</p>
          </div>
        ) : (
          <div className="mt-4">
            <button
              type="button"
              onClick={handleStartVerification}
              disabled={checkingOnChain}
              className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-60"
            >
              {checkingOnChain ? "Checking…" : "Start verification"}
            </button>
            {errorMsg && (
              <p className="mt-2 text-sm text-red-600">{errorMsg}</p>
            )}

            <Dialog open={open} onOpenChange={setOpen}>
              <DialogContent className="sm:max-w-xl">
                <DialogHeader>
                  <DialogTitle>Verify your identity with Self</DialogTitle>
                  <DialogDescription>
                    Scan the QR code with the Self app to create a private ZK proof
                    of your residency and eligible assets.
                  </DialogDescription>
                </DialogHeader>
                <div className="mt-2">
                  <SelfVerification
                    onVerified={() => setIsVerified(true)}
                    onClose={() => setOpen(false)}
                  />
                </div>
              </DialogContent>
            </Dialog>
          </div>
        )}
      </section>
    </main>
  )
}
