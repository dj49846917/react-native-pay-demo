import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { initialApprovals, initialTransactions } from '../data/mock';
import type { ApprovalItem, CryptoTransaction, OperationType } from '../types';

interface AppState {
  authenticated: boolean;
  transactions: CryptoTransaction[];
  approvals: ApprovalItem[];
  unreadNotifications: number;
  login: () => void;
  logout: () => void;
  markNotificationsRead: () => void;
  handleApproval: (id: string) => void;
  createOperation: (type: OperationType, asset: string, amount: number) => void;
}

const operationLabels: Record<OperationType, string> = {
  deposit: '充值',
  withdraw: '提现',
  swap: '换币',
  invoice: 'Invoice',
  offramp: '法币出金',
  batch: '批量付款',
};

export const useAppStore = create<AppState>()(
  persist(
    set => ({
      authenticated: false,
      transactions: initialTransactions,
      approvals: initialApprovals,
      unreadNotifications: 2,
      login: () => set({ authenticated: true }),
      logout: () => set({ authenticated: false }),
      markNotificationsRead: () => set({ unreadNotifications: 0 }),
      handleApproval: id =>
        set(state => ({
          approvals: state.approvals.filter(item => item.id !== id),
        })),
      createOperation: (type, asset, amount) =>
        set(state => ({
          transactions: [
            {
              id: `TX-${Date.now().toString().slice(-6)}`,
              type: operationLabels[type],
              asset,
              amount: type === 'deposit' ? amount : -amount,
              fiatAmount: amount,
              counterparty: '演示请求',
              date: new Date().toISOString(),
              status: 'pending',
              hash: `demo-${Date.now()}`,
            },
            ...state.transactions,
          ],
        })),
    }),
    {
      name: 'cryptopay-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: state => ({
        authenticated: state.authenticated,
        transactions: state.transactions,
        approvals: state.approvals,
        unreadNotifications: state.unreadNotifications,
      }),
    },
  ),
);
