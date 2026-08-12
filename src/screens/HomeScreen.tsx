import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import {
  ArrowDownLeft,
  ArrowUpRight,
  Bell,
  FileText,
  Plus,
  Repeat2,
} from 'lucide-react-native';
import { assets } from '../data/mock';
import {
  Card,
  Header,
  Screen,
  SectionTitle,
  StatusBadge,
} from '../components/ui';
import { colors, radius } from '../theme';
import { useAppStore } from '../store/useAppStore';
import type { RootStackParamList } from '../navigation/types';
import type { OperationType } from '../types';

export function HomeScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const transactions = useAppStore(state => state.transactions);
  const unread = useAppStore(state => state.unreadNotifications);
  const total = assets.reduce((sum, item) => sum + item.fiatValue, 0);
  const actions: Array<
    [
      OperationType,
      string,
      React.ComponentType<{ color?: string; size?: number }>,
    ]
  > = [
    ['deposit', '充值', Plus],
    ['withdraw', '提现', ArrowUpRight],
    ['swap', '换币', Repeat2],
    ['invoice', 'Invoice', FileText],
  ];
  return (
    <Screen>
      <Header
        title="CryptoPay"
        action={
          <Pressable
            onPress={() => navigation.navigate('Notifications')}
            style={styles.bell}
          >
            <Bell color={colors.ink} />
            {unread ? (
              <View style={styles.dot}>
                <Text style={styles.dotText}>{unread}</Text>
              </View>
            ) : null}
          </Pressable>
        }
      />
      <View style={styles.balance}>
        <Text style={styles.balanceLabel}>总资产估值</Text>
        <Text style={styles.balanceValue}>
          ${total.toLocaleString('en-US', { minimumFractionDigits: 2 })}
        </Text>
        <View style={styles.metrics}>
          <Metric icon={ArrowDownLeft} label="本月流入" value="$128,430" />
          <Metric icon={ArrowUpRight} label="本月流出" value="$86,240" />
        </View>
      </View>
      <View style={styles.quick}>
        {actions.map(([type, label, Icon]) => (
          <Pressable
            key={type}
            onPress={() => navigation.navigate('Operation', { type })}
            style={styles.quickItem}
          >
            <View style={styles.quickIcon}>
              <Icon color={colors.primary} size={24} />
            </View>
            <Text style={styles.quickText}>{label}</Text>
          </Pressable>
        ))}
      </View>
      <Card style={styles.stats}>
        <Stat value="3" label="待审批" color={colors.warning} />
        <Stat value="126" label="本月交易" color={colors.primary} />
        <Stat value="98.7%" label="成功率" color={colors.success} />
      </Card>
      <SectionTitle
        title="资产"
        action="资金管理"
        onAction={() => navigation.navigate('Main', { screen: 'Payments' })}
      />
      <Card>
        {assets.map((asset, index) => (
          <View
            key={asset.symbol}
            style={[styles.asset, index > 0 && styles.line]}
          >
            <View style={styles.coin}>
              <Text style={styles.coinText}>{asset.symbol[0]}</Text>
            </View>
            <View style={styles.grow}>
              <Text style={styles.name}>{asset.symbol}</Text>
              <Text style={styles.muted}>{asset.name}</Text>
            </View>
            <View style={styles.alignRight}>
              <Text style={styles.name}>
                {asset.amount.toFixed(asset.symbol === 'BTC' ? 4 : 2)}
              </Text>
              <Text
                style={{
                  color: asset.change >= 0 ? colors.success : colors.danger,
                }}
              >
                {asset.change >= 0 ? '+' : ''}
                {asset.change}%
              </Text>
            </View>
          </View>
        ))}
      </Card>
      <SectionTitle
        title="最近交易"
        action="全部"
        onAction={() => navigation.navigate('Main', { screen: 'Transactions' })}
      />
      <Card>
        {transactions.slice(0, 3).map((tx, index) => (
          <Pressable
            key={tx.id}
            onPress={() =>
              navigation.navigate('TransactionDetail', { id: tx.id })
            }
            style={[styles.asset, index > 0 && styles.line]}
          >
            <View style={styles.coin}>
              <Repeat2 color={colors.primary} size={20} />
            </View>
            <View style={styles.grow}>
              <Text style={styles.name}>{tx.type}</Text>
              <Text style={styles.muted} numberOfLines={1}>
                {tx.counterparty}
              </Text>
            </View>
            <View style={styles.alignRight}>
              <Text style={styles.name}>
                {tx.amount > 0 ? '+' : ''}
                {tx.amount} {tx.asset}
              </Text>
              <StatusBadge status={tx.status} />
            </View>
          </Pressable>
        ))}
      </Card>
    </Screen>
  );
}

function Metric({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ color?: string; size?: number }>;
  label: string;
  value: string;
}) {
  return (
    <View style={styles.metric}>
      <Icon color={colors.secondary} size={18} />
      <View>
        <Text style={styles.balanceLabel}>{label}</Text>
        <Text style={styles.metricValue}>{value}</Text>
      </View>
    </View>
  );
}
function Stat({
  value,
  label,
  color,
}: {
  value: string;
  label: string;
  color: string;
}) {
  return (
    <View style={styles.stat}>
      <Text style={[styles.statValue, { color }]}>{value}</Text>
      <Text style={styles.muted}>{label}</Text>
    </View>
  );
}

export function NotificationsScreen() {
  const unread = useAppStore(state => state.unreadNotifications);
  const markRead = useAppStore(state => state.markNotificationsRead);
  const items = [
    ['新的审批请求', 'Marcus 提交了一笔 8,200 USDC 法币出金。', '10 分钟前'],
    ['BTC 充值已到账', '0.12 BTC 已达到网络确认数并计入余额。', '4 小时前'],
    ['新设备登录', 'Chrome on macOS 在上海登录了企业账户。', '昨天'],
  ];
  return (
    <Screen>
      <View style={styles.readRow}>
        <Text style={styles.muted}>{unread} 条未读</Text>
        <Pressable onPress={markRead}>
          <Text style={styles.link}>全部已读</Text>
        </Pressable>
      </View>
      {items.map((item, index) => (
        <Card key={item[0]} style={index < unread ? styles.unread : undefined}>
          <Text style={styles.name}>{item[0]}</Text>
          <Text style={styles.notification}>{item[1]}</Text>
          <Text style={styles.muted}>{item[2]}</Text>
        </Card>
      ))}
    </Screen>
  );
}

const styles = StyleSheet.create({
  bell: { padding: 8 },
  dot: {
    position: 'absolute',
    right: 0,
    top: 0,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: colors.danger,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dotText: { color: colors.white, fontSize: 10, fontWeight: '800' },
  balance: {
    padding: 22,
    borderRadius: radius.lg,
    backgroundColor: '#302A5E',
    gap: 12,
  },
  balanceLabel: { color: '#FFFFFFB3', fontSize: 12 },
  balanceValue: { color: colors.white, fontSize: 34, fontWeight: '900' },
  metrics: { flexDirection: 'row', gap: 26, marginTop: 8 },
  metric: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 7 },
  metricValue: { color: colors.white, fontWeight: '800' },
  quick: { flexDirection: 'row', justifyContent: 'space-around' },
  quickItem: { alignItems: 'center', gap: 7 },
  quickIcon: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickText: { fontWeight: '700', color: colors.ink },
  stats: { flexDirection: 'row' },
  stat: { flex: 1, alignItems: 'center', gap: 3 },
  statValue: { fontSize: 20, fontWeight: '900' },
  muted: { color: colors.muted, fontSize: 12 },
  asset: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    gap: 12,
  },
  line: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
  },
  coin: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  coinText: { color: colors.primary, fontWeight: '800' },
  grow: { flex: 1, gap: 3 },
  name: { fontWeight: '800', color: colors.ink },
  alignRight: { alignItems: 'flex-end', gap: 3 },
  readRow: { flexDirection: 'row', justifyContent: 'space-between' },
  link: { color: colors.primary, fontWeight: '800' },
  unread: { backgroundColor: '#F2EFFF' },
  notification: { color: colors.ink, lineHeight: 21, marginVertical: 7 },
});
