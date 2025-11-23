// app/providers.tsx
'use client'

import {PrivyProvider} from '@privy-io/react-auth'
import {ReactNode} from 'react'

export function Providers({children}: { children: ReactNode }) {
    return (
        <PrivyProvider
            appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID || ''}
            config={{
                loginMethods: ['wallet'],
                appearance: {
                    theme: 'dark',
                    accentColor: '#000000'
                }
            }}
        >
            {children}
        </PrivyProvider>
    )
}