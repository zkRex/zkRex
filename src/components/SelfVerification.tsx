'use client';

import React, { useState, useEffect } from 'react';
import { getUniversalLink } from "@selfxyz/core";
import {
    SelfQRcodeWrapper,
    SelfAppBuilder,
    type SelfApp,
} from "@selfxyz/qrcode";
import {usePrivy} from "@privy-io/react-auth";



function VerificationPage() {
    const [selfApp, setSelfApp] = useState<SelfApp | null>(null);
    const [universalLink, setUniversalLink] = useState("");
    const {user} = usePrivy();
    const [userId] = useState(user?.wallet?.address);

    useEffect(() => {
        console.log("seed", process.env.NEXT_PUBLIC_SELF_SCOPE_SEED);
        try {
            const app = new SelfAppBuilder({
                version: 2,
                appName: "ZkRexID",
                scope:"ZkRexID",
                endpoint: process.env.NEXT_PUBLIC_ZK_ENDPOINT?.toLowerCase(),
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
    }, [userId]);

    const handleSuccessfulVerification = () => {
        console.log("Verification successful!");
    };

    return (
        <div className="verification-container">
            <h1>Verify Your Identity</h1>
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
        </div>
    );
}

export default VerificationPage;