import { keccak256, toHex } from 'viem';
import { DataCommitment, Attestation } from './types';

const DEMO_SEED = [
  {
    schemaType: 'resume' as const,
    data: 'Senior Software Engineer at Google, 2018-2022. Staff Engineer at Stripe, 2022-2025. Skills: distributed systems, Rust, Go, Kubernetes, system design. Education: MS Computer Science, Stanford 2018. Publications: 3 papers on distributed consensus.',
  },
  {
    schemaType: 'financial' as const,
    data: 'ETH: 12.5 ($42,500)\nBTC: 0.8 ($52,000)\nUSDC: 15,000\nSOL: 450 ($67,500)\nTotal Portfolio: $177,000\nMonthly Income: $18,500\nDebt: $0',
  },
  {
    schemaType: 'calendar' as const,
    data: 'Monday 9am-10am: Team Standup\nMonday 2pm-5pm: Deep Work Block\nTuesday 10am-11am: 1:1 with Manager\nTuesday 1pm-3pm: Free\nWednesday 9am-12pm: Sprint Planning\nWednesday 2pm-5pm: Free\nThursday ALL DAY: Focus Day (no meetings)\nFriday 10am-11am: Team Retro\nFriday 1pm-5pm: Free',
  },
] as const;

const DEMO_ATTESTATIONS = [
  {
    query: 'Does this person have 5+ years experience?',
    answer: true,
    confidence: 94,
    reasoning: 'The data indicates professional experience spanning approximately 7 years across two senior engineering positions at major technology companies.',
  },
  {
    query: 'Have they worked at a FAANG company?',
    answer: true,
    confidence: 97,
    reasoning: 'The employment history contains a position at one of the major technology companies commonly grouped in this category.',
  },
];

class DataStore {
  private commitments: Map<string, DataCommitment> = new Map();
  private privateData: Map<string, string> = new Map(); // commitmentId -> raw data
  private attestations: Map<string, Attestation[]> = new Map(); // commitmentId -> attestations

  constructor() {
    this.seedDemoData();
  }

  private seedDemoData() {
    const baseTimestamp = 1710000000000; // fixed timestamp for determinism

    for (let i = 0; i < DEMO_SEED.length; i++) {
      const seed = DEMO_SEED[i];
      const dataHash = keccak256(toHex(seed.data));
      const id = keccak256(
        toHex(`demo-${seed.schemaType}-${dataHash}`)
      );

      const commitment: DataCommitment = {
        id,
        dataHash,
        depositor: '0xDEAD000000000000000000000000000000000000',
        timestamp: baseTimestamp + i * 3600000,
        schemaType: seed.schemaType,
        active: true,
      };

      this.commitments.set(commitment.id, commitment);
      this.privateData.set(commitment.id, seed.data);

      // Add attestations to the resume commitment
      if (seed.schemaType === 'resume') {
        const attestations: Attestation[] = DEMO_ATTESTATIONS.map((att, j) => ({
          commitmentId: id,
          queryHash: keccak256(toHex(att.query)),
          query: att.query,
          answer: att.answer,
          confidence: att.confidence,
          reasoning: att.reasoning,
          timestamp: baseTimestamp + (j + 1) * 1800000,
          txHash: keccak256(toHex(`demo-tx-${id}-${j}`)),
        }));
        this.attestations.set(id, attestations);
      }
    }
  }

  addCommitment(commitment: DataCommitment, rawData: string) {
    this.commitments.set(commitment.id, commitment);
    this.privateData.set(commitment.id, rawData);
  }

  getCommitment(id: string): DataCommitment | undefined {
    return this.commitments.get(id);
  }

  getPrivateData(id: string): string | undefined {
    return this.privateData.get(id);
  }

  addAttestation(commitmentId: string, attestation: Attestation) {
    const existing = this.attestations.get(commitmentId) || [];
    existing.push(attestation);
    this.attestations.set(commitmentId, existing);
  }

  getAttestations(commitmentId: string): Attestation[] {
    return this.attestations.get(commitmentId) || [];
  }

  getAllCommitments(): DataCommitment[] {
    return Array.from(this.commitments.values());
  }
}

export const store = new DataStore();
