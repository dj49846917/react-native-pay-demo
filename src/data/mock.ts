import type {
  ApprovalItem,
  AssetBalance,
  Campaign,
  CryptoTransaction,
} from '../types';

export const assets: AssetBalance[] = [
  {
    symbol: 'USDT',
    name: 'Tether',
    amount: 68420.25,
    fiatValue: 68420.25,
    change: 0.02,
  },
  {
    symbol: 'BTC',
    name: 'Bitcoin',
    amount: 0.8421,
    fiatValue: 98125.4,
    change: 2.84,
  },
  {
    symbol: 'ETH',
    name: 'Ethereum',
    amount: 12.48,
    fiatValue: 45672.18,
    change: -1.12,
  },
  {
    symbol: 'USDC',
    name: 'USD Coin',
    amount: 22500,
    fiatValue: 22500,
    change: 0.01,
  },
];

export const initialTransactions: CryptoTransaction[] = [
  {
    id: 'TX-204891',
    type: '批量付款',
    asset: 'USDT',
    amount: -12500,
    fiatAmount: 12500,
    counterparty: '供应商批次 #A230',
    date: new Date(Date.now() - 42 * 60000).toISOString(),
    status: 'pending',
    hash: '0x71bc9e2f7d39a3e8c8f43a2c74df',
  },
  {
    id: 'TX-204890',
    type: '充值',
    asset: 'BTC',
    amount: 0.12,
    fiatAmount: 13984.32,
    counterparty: 'External wallet',
    date: new Date(Date.now() - 4 * 3600000).toISOString(),
    status: 'completed',
    hash: '0xc38a951e3bcff2e0eafd7482e1cb',
  },
  {
    id: 'TX-204889',
    type: '换币',
    asset: 'ETH',
    amount: 3.4,
    fiatAmount: 12443.1,
    counterparty: 'BTC → ETH',
    date: new Date(Date.now() - 86400000).toISOString(),
    status: 'completed',
    hash: 'internal-swap-982144',
  },
  {
    id: 'TX-204888',
    type: '法币出金',
    asset: 'USDC',
    amount: -8200,
    fiatAmount: 8200,
    counterparty: 'HSBC •• 8841',
    date: new Date(Date.now() - 2 * 86400000).toISOString(),
    status: 'rejected',
    hash: 'offramp-218820',
  },
];

export const initialApprovals: ApprovalItem[] = [
  {
    id: 'AP-8821',
    title: '供应商付款',
    requester: 'Alice Chen',
    amount: 12500,
    asset: 'USDT',
    createdAt: new Date(Date.now() - 42 * 60000).toISOString(),
  },
  {
    id: 'AP-8819',
    title: '法币出金',
    requester: 'Marcus Lee',
    amount: 8200,
    asset: 'USDC',
    createdAt: new Date(Date.now() - 3 * 3600000).toISOString(),
  },
  {
    id: 'AP-8812',
    title: '营销费用报销',
    requester: 'Sofia Wong',
    amount: 2.8,
    asset: 'ETH',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
];

export const campaigns: Campaign[] = [
  {
    id: 'CP-01',
    title: '夏季交易挑战',
    description: '累计换币达到 50,000 USDT',
    progress: 0.68,
    reward: '80 USDT',
    endsAt: '12 天后结束',
  },
  {
    id: 'CP-02',
    title: '邀请企业伙伴',
    description: '完成企业认证后双方获得奖励',
    progress: 0.4,
    reward: '100 USDT',
    endsAt: '25 天后结束',
  },
];
