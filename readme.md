# **zkREX** - Privacy-Preserving Compliance for RWA Tokens

zkREX is a zero-knowledge compliance gateway for private tokenized assets.
It combines Self Protocol for zkKYC, Oasis Sapphire for confidential token execution, vLayer for additional zero-knowledge data proofs, and Privy for seamless wallet onboarding.

The result:
A secure, compliant, and privacy-preserving environment for trading RWA-style tokens, without exposing personal data or on-chain balances.

## **What We Built**

zkREX enables users to prove regulatory compliance privately and then interact with a confidential RWA token on Oasis.

## Zero-Knowledge KYC with Self Protocol

Users generate zk proofs for:

* Age ≥ 18
* Not on OFAC / not sanctioned
* Country is in the allowed list

Self’s onchain SDK verifies these proofs without revealing identity, passport details, or personal information.

## Private Transactions with Oasis Sapphire

T-Rex Token (our demo asset) is deployed on Oasis Sapphire, giving:

* Private balances
* Private transfer amounts
* Confidential smart contract execution
* No observable token movements on public state

This is ideal for private RWAs, security tokens, and sensitive financial flows.

## Additional Data via vLayer (Optional)

Users may enhance their compliance by providing:

* Proof of funds
* Proof of address

All verified using zkTLS and compressed via vLayer’s Prover Server into zero-knowledge proofs consumed by our smart contracts.

## Privy Wallet Integration

Users onboard instantly using:

* Email
* Social login
* Passkeys
* Embedded smart wallet

Privy ensures a smooth UX for RWA users who may not be crypto-native.
