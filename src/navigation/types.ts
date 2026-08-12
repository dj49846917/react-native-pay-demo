import type { NavigatorScreenParams } from '@react-navigation/native';
import type { OperationType } from '../types';

export type MainTabParamList = {
  Home: undefined;
  Transactions: undefined;
  Payments: undefined;
  Approvals: undefined;
  Profile: undefined;
};

export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
  Main: NavigatorScreenParams<MainTabParamList> | undefined;
  Captcha: { onVerified?: () => void } | undefined;
  Notifications: undefined;
  TransactionDetail: { id: string };
  Operation: { type: OperationType };
  Activities: undefined;
  ProfileSection: { section: string; title: string };
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
