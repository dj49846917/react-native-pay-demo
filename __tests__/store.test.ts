import {initialApprovals, initialTransactions} from '../src/data/mock';
import {useAppStore} from '../src/store/useAppStore';

beforeEach(() => {
  useAppStore.setState({
    authenticated: false,
    transactions: initialTransactions,
    approvals: initialApprovals,
    unreadNotifications: 2,
  });
});

test('login and logout update authentication state', () => {
  useAppStore.getState().login();
  expect(useAppStore.getState().authenticated).toBe(true);

  useAppStore.getState().logout();
  expect(useAppStore.getState().authenticated).toBe(false);
});

test('approved requests are removed from pending approvals', () => {
  const id = initialApprovals[0].id;
  useAppStore.getState().handleApproval(id);
  expect(useAppStore.getState().approvals.some(item => item.id === id)).toBe(false);
});

test('submitted payment creates a pending transaction', () => {
  useAppStore.getState().createOperation('withdraw', 'USDT', 128);
  const transaction = useAppStore.getState().transactions[0];

  expect(transaction.type).toBe('提现');
  expect(transaction.amount).toBe(-128);
  expect(transaction.status).toBe('pending');
});
