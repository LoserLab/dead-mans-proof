export interface DataCommitment {
  id: string;
  dataHash: string;
  depositor: string;
  timestamp: number;
  schemaType: 'resume' | 'financial' | 'calendar';
  active: boolean;
}

export interface Attestation {
  commitmentId: string;
  queryHash: string;
  query: string;
  answer: boolean;
  confidence: number;
  reasoning: string;
  timestamp: number;
  txHash?: string;
}

export interface DepositRequest {
  data: string;
  schemaType: 'resume' | 'financial' | 'calendar';
}

export interface QueryRequest {
  commitmentId: string;
  query: string;
}

export interface AgentEvaluation {
  answer: boolean;
  confidence: number;
  reasoning: string;
}
