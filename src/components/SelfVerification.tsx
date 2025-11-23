'use client';

import React, { useState, useEffect } from 'react';
import { getUniversalLink } from "@selfxyz/core";
import {
    SelfQRcodeWrapper,
    SelfAppBuilder,
    type SelfApp,
} from "@selfxyz/qrcode";
import {usePrivy} from "@privy-io/react-auth";



type VerificationProps = {
    // Optional: called after we have successfully saved verification locally
    onVerified?: () => void;
    // Optional: close the surrounding dialog/sheet if present
    onClose?: () => void;
    // Optional: delay (ms) before auto-closing after success; default 1200ms
    autoCloseDelayMs?: number;
}

function VerificationPage({ onVerified, onClose, autoCloseDelayMs = 1200 }: VerificationProps) {
    const [selfApp, setSelfApp] = useState<SelfApp | null>(null);
    const [universalLink, setUniversalLink] = useState("");
    const {user} = usePrivy();
    const [userId] = useState(user?.wallet?.address);
    const VERIFIED_KEY = 'zkrex_identity_verified';
    const [isVerified, setIsVerified] = useState<boolean>(false);
    const [justVerified, setJustVerified] = useState<boolean>(false);

    // Pre-check local storage for existing verification
    useEffect(() => {
        try {
            const raw = typeof window !== 'undefined' ? localStorage.getItem(VERIFIED_KEY) : null;
            const parsed = raw ? JSON.parse(raw) : null;
            setIsVerified(!!parsed?.verified);
        } catch (e) {
            // If storage is blocked or malformed, treat as not verified
            setIsVerified(false);
        }
    }, []);

    useEffect(() => {
        console.log("seed", process.env.NEXT_PUBLIC_SELF_SCOPE_SEED);
        try {
            if (isVerified) {
                // Skip initializing the QR flow if already verified
                return;
            }
            const app = new SelfAppBuilder({
                version: 2,
                appName: "ZkRexID",
                scope:"ZkRexID",
                // Prefer dedicated SELF endpoint; fall back to legacy ZK endpoint env if needed.
                endpoint: (process.env.NEXT_PUBLIC_SELF_ENDPOINT || process.env.NEXT_PUBLIC_ZK_ENDPOINT)?.toLowerCase(),
                logoBase64: "https://i.postimg.cc/mrmVf9hm/self.png",
                userId: userId,
                endpointType: "staging_celo",
                userIdType: "hex",
                disclosures: {
                    //check the API reference for more disclose attributes!
                    minimumAge: 18,
                    nationality: true,
                }
            }).build();

            console.log("Self app created:", {app});

            setSelfApp(app);
            setUniversalLink(getUniversalLink(app));
        } catch (error) {
            console.error("Failed to initialize Self app:", error);
        }
    }, [userId, isVerified]);

    const handleSuccessfulVerification = () => {
        console.log("Verification successful!");
        // Persist a local config value indicating the user is verified
        try {
            const value = {
                verified: true,
                at: new Date().toISOString(),
                userId: userId ?? null,
            };
            localStorage.setItem(VERIFIED_KEY, JSON.stringify(value));
            setIsVerified(true);
            setJustVerified(true);
        } catch (e) {
            console.warn("Failed to write verification status to localStorage", e);
        }
        // Fire callback for parent listeners
        try { onVerified?.(); } catch {}
        // Auto-close parent dialog if provided, after brief confirmation display
        if (onClose) {
            setTimeout(() => {
                try { onClose(); } catch {}
            }, Math.max(0, autoCloseDelayMs));
        }
    };

    return (
        <div className="verification-container">
            <h1>Verify Your Identity</h1>
            {isVerified ? (
                <div className="mt-3 rounded-md border border-green-600/30 bg-green-600/10 p-3 text-sm">
                    <p className="font-medium text-green-700 dark:text-green-400">You have been verified.</p>
                    {justVerified && (
                        <p className="text-green-700/90 dark:text-green-300/90 mt-1">Great! We saved your status on this device{onClose ? ", closing…" : "."}</p>
                    )}
                </div>
            ) : (
                <>
                    <p>Scan this QR code with the Self app</p>
                    {selfApp ? (
                        <SelfQRcodeWrapper
                            selfApp={selfApp}
                            onSuccess={handleSuccessfulVerification}
                            onError={(err) => {
                                console.error("Error: Failed to verify identity", {err});
                            }}
                        />
                    ) : (
                        <div>Loading QR Code...</div>
                    )}
                </>
            )}
        </div>
    );
}

export default VerificationPage;