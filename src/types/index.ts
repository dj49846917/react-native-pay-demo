export type TransactionStatus = 'completed' | 'pending' | 'rejected';

export interface AssetBalance {
  symbol: string;
  name: string;
  amount: number;
  fiatValue: number;
  change: number;
}

export interface CryptoTransaction {
  id: string;
  type: string;
  asset: string;
  amount: number;
  fiatAmount: number;
  counterparty: string;
  date: string;
  status: TransactionStatus;
  hash: string;
}

export interface ApprovalItem {
  id: string;
  title: string;
  requester: string;
  amount: number;
  asset: string;
  createdAt: string;
}

export interface Campaign {
  id: string;
  title: string;
  description: string;
  progress: number;
  reward: string;
  endsAt: string;
}

export type OperationType =
  | 'deposit'
  | 'withdraw'
  | 'swap'
  | 'invoice'
  | 'offramp'
  | 'batch';
