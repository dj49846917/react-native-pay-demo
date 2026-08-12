import React from 'react';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {
  BadgeCheck,
  CircleDollarSign,
  Grid2X2,
  ReceiptText,
  UserRound,
} from 'lucide-react-native';
import { colors } from '../theme';
import { useAppStore } from '../store/useAppStore';
import { AuthScreen } from '../screens/AuthScreen';
import { HomeScreen, NotificationsScreen } from '../screens/HomeScreen';
import {
  TransactionsScreen,
  TransactionDetailScreen,
} from '../screens/TransactionsScreen';
import { PaymentsScreen, OperationScreen } from '../screens/PaymentsScreen';
import { ApprovalsScreen } from '../screens/ApprovalsScreen';
import {
  ActivitiesScreen,
  ProfileScreen,
  ProfileSectionScreen,
} from '../screens/ProfileScreen';
import type { MainTabParamList, RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

const navTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: colors.primary,
    background: colors.background,
    card: colors.surface,
    text: colors.ink,
    border: colors.border,
  },
};

const tabIcons = {
  Home: Grid2X2,
  Transactions: ReceiptText,
  Payments: CircleDollarSign,
  Approvals: BadgeCheck,
  Profile: UserRound,
};

function TabIcon({
  name,
  color,
  size,
}: {
  name: keyof MainTabParamList;
  color: string;
  size: number;
}) {
  const Icon = tabIcons[name];
  return <Icon color={color} size={size} />;
}

const tabScreenOptions = ({
  route,
}: {
  route: { name: keyof MainTabParamList };
}) => ({
  headerShown: false,
  tabBarActiveTintColor: colors.primary,
  tabBarInactiveTintColor: colors.muted,
  tabBarStyle: { height: 72, paddingTop: 8, paddingBottom: 10 },
  tabBarIcon: ({ color, size }: { color: string; size: number }) => (
    <TabIcon name={route.name} color={color} size={size} />
  ),
});

function MainTabs() {
  return (
    <Tab.Navigator screenOptions={tabScreenOptions}>
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{ title: '首页' }}
      />
      <Tab.Screen
        name="Transactions"
        component={TransactionsScreen}
        options={{ title: '交易' }}
      />
      <Tab.Screen
        name="Payments"
        component={PaymentsScreen}
        options={{ title: '资金' }}
      />
      <Tab.Screen
        name="Approvals"
        component={ApprovalsScreen}
        options={{ title: '审批' }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ title: '我的' }}
      />
    </Tab.Navigator>
  );
}

export function RootNavigator() {
  const authenticated = useAppStore(state => state.authenticated);
  return (
    <NavigationContainer theme={navTheme}>
      <Stack.Navigator
        screenOptions={{
          headerBackTitle: '返回',
          headerTintColor: colors.primary,
          contentStyle: { backgroundColor: colors.background },
        }}
      >
        {!authenticated ? (
          <>
            <Stack.Screen name="Login" options={{ headerShown: false }}>
              {() => <AuthScreen mode="login" />}
            </Stack.Screen>
            <Stack.Screen name="Register" options={{ title: '注册' }}>
              {() => <AuthScreen mode="register" />}
            </Stack.Screen>
            <Stack.Screen name="ForgotPassword" options={{ title: '找回密码' }}>
              {() => <AuthScreen mode="forgot" />}
            </Stack.Screen>
          </>
        ) : (
          <>
            <Stack.Screen
              name="Main"
              component={MainTabs}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Notifications"
              component={NotificationsScreen}
              options={{ title: '通知中心' }}
            />
            <Stack.Screen
              name="TransactionDetail"
              component={TransactionDetailScreen}
              options={{ title: '交易详情' }}
            />
            <Stack.Screen
              name="Operation"
              component={OperationScreen}
              options={{ title: '资金操作' }}
            />
            <Stack.Screen
              name="Activities"
              component={ActivitiesScreen}
              options={{ title: '活动中心' }}
            />
            <Stack.Screen
              name="ProfileSection"
              component={ProfileSectionScreen}
              options={({ route }) => ({ title: route.params.title })}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
