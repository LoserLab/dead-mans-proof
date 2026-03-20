import { Mppx, tempo } from 'mppx/server';

/**
 * MPP (Machine Payments Protocol) configuration for Dead Man's Proof.
 *
 * Attestation queries are the paid service. Deposits and browsing are free.
 *
 * Required env vars:
 *   MPP_SECRET_KEY        - HMAC secret for challenge binding (any random string)
 *   MPP_RECIPIENT_ADDRESS - Tempo wallet address to receive payments
 *
 * Optional:
 *   STRIPE_SECRET_KEY     - Enable fiat payments via Stripe
 *   STRIPE_NETWORK_ID     - Stripe Business Network profile ID
 */

// Whether MPP is fully configured and should gate queries
export const mppEnabled =
  !!process.env.MPP_SECRET_KEY && !!process.env.MPP_RECIPIENT_ADDRESS;

function buildMethods() {
  const methods = [];

  // Tempo (crypto payments on Tempo chain)
  if (process.env.MPP_RECIPIENT_ADDRESS) {
    methods.push(
      tempo.charge({
        currency: '0x20c0000000000000000000000000000000000000' as `0x${string}`,
        recipient: process.env.MPP_RECIPIENT_ADDRESS as `0x${string}`,
        testnet: true, // Tempo Moderato testnet for now
      })
    );
  }

  // Stripe can be added here once account is set up:
  // if (process.env.STRIPE_SECRET_KEY) {
  //   methods.push(
  //     stripe.charge({
  //       secretKey: process.env.STRIPE_SECRET_KEY,
  //       networkId: process.env.STRIPE_NETWORK_ID || 'internal',
  //       paymentMethodTypes: ['card'],
  //     })
  //   );
  // }

  return methods;
}

// Only create Mppx instance if configured
export const mppx = mppEnabled
  ? Mppx.create({
      methods: buildMethods(),
      secretKey: process.env.MPP_SECRET_KEY,
    })
  : null;

// Pricing: cost per attestation query
export const QUERY_PRICE = '0.01'; // 0.01 pathUSD per query
export const QUERY_DESCRIPTION = 'Privacy-preserving attestation query against sealed data';
