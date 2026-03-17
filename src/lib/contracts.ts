import { createPublicClient, createWalletClient, http, keccak256, toBytes, type Hex } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { baseSepolia } from 'viem/chains';

const VAULT_ABI = [
  {
    name: 'depositCommitment',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'dataHash', type: 'bytes32' },
      { name: 'schemaType', type: 'string' },
    ],
    outputs: [{ name: 'commitmentId', type: 'bytes32' }],
  },
  {
    name: 'publishAttestation',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'commitmentId', type: 'bytes32' },
      { name: 'queryHash', type: 'bytes32' },
      { name: 'answer', type: 'bool' },
      { name: 'confidence', type: 'uint8' },
      { name: 'reasoningURI', type: 'string' },
    ],
    outputs: [],
  },
  {
    name: 'getAttestations',
    type: 'function',
    stateMutability: 'view',
    inputs: [{ name: 'commitmentId', type: 'bytes32' }],
    outputs: [
      {
        name: '',
        type: 'tuple[]',
        components: [
          { name: 'commitmentId', type: 'bytes32' },
          { name: 'queryHash', type: 'bytes32' },
          { name: 'answer', type: 'bool' },
          { name: 'confidence', type: 'uint8' },
          { name: 'reasoningURI', type: 'string' },
          { name: 'timestamp', type: 'uint256' },
        ],
      },
    ],
  },
  {
    name: 'commitments',
    type: 'function',
    stateMutability: 'view',
    inputs: [{ name: '', type: 'bytes32' }],
    outputs: [
      { name: 'dataHash', type: 'bytes32' },
      { name: 'depositor', type: 'address' },
      { name: 'timestamp', type: 'uint256' },
      { name: 'schemaType', type: 'string' },
      { name: 'active', type: 'bool' },
    ],
  },
  {
    name: 'getAttestationCount',
    type: 'function',
    stateMutability: 'view',
    inputs: [{ name: 'commitmentId', type: 'bytes32' }],
    outputs: [{ name: '', type: 'uint256' }],
  },
  {
    name: 'commitmentCount',
    type: 'function',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ name: '', type: 'uint256' }],
  },
  {
    name: 'attestationCount',
    type: 'function',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ name: '', type: 'uint256' }],
  },
] as const;

function getChain() {
  // Default to Base Sepolia for development, Base Mainnet for production
  return baseSepolia;
}

function getContractAddress(): Hex {
  const address = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;
  if (!address) throw new Error('NEXT_PUBLIC_CONTRACT_ADDRESS not set');
  return address as Hex;
}

function getAgentAccount() {
  const key = process.env.AGENT_PRIVATE_KEY;
  if (!key) throw new Error('AGENT_PRIVATE_KEY not set');
  return privateKeyToAccount(key as Hex);
}

const publicClient = createPublicClient({
  chain: getChain(),
  transport: http(),
});

function getWalletClient() {
  return createWalletClient({
    account: getAgentAccount(),
    chain: getChain(),
    transport: http(),
  });
}

export function hashData(data: string): Hex {
  return keccak256(toBytes(data));
}

export function hashQuery(query: string): Hex {
  return keccak256(toBytes(query));
}

export async function depositCommitmentOnChain(dataHash: Hex, schemaType: string): Promise<Hex> {
  const wallet = getWalletClient();
  const hash = await wallet.writeContract({
    address: getContractAddress(),
    abi: VAULT_ABI,
    functionName: 'depositCommitment',
    args: [dataHash, schemaType],
  });
  return hash;
}

export async function publishAttestationOnChain(
  commitmentId: Hex,
  queryHash: Hex,
  answer: boolean,
  confidence: number,
  reasoningURI: string
): Promise<Hex> {
  const wallet = getWalletClient();
  const hash = await wallet.writeContract({
    address: getContractAddress(),
    abi: VAULT_ABI,
    functionName: 'publishAttestation',
    args: [commitmentId, queryHash, answer, confidence, reasoningURI],
  });
  return hash;
}

export async function getAttestationsFromChain(commitmentId: Hex) {
  const data = await publicClient.readContract({
    address: getContractAddress(),
    abi: VAULT_ABI,
    functionName: 'getAttestations',
    args: [commitmentId],
  });
  return data;
}

export async function getCommitmentFromChain(commitmentId: Hex) {
  const data = await publicClient.readContract({
    address: getContractAddress(),
    abi: VAULT_ABI,
    functionName: 'commitments',
    args: [commitmentId],
  });
  return data;
}

export async function getStats() {
  const [commitments, attestations] = await Promise.all([
    publicClient.readContract({
      address: getContractAddress(),
      abi: VAULT_ABI,
      functionName: 'commitmentCount',
    }),
    publicClient.readContract({
      address: getContractAddress(),
      abi: VAULT_ABI,
      functionName: 'attestationCount',
    }),
  ]);
  return { commitmentCount: Number(commitments), attestationCount: Number(attestations) };
}
