import React, { useState } from 'react';
import { Alert, Pressable, Share, StyleSheet, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { Download, Repeat2 } from 'lucide-react-native';
import { Card, Header, Screen, StatusBadge } from '../components/ui';
import { colors } from '../theme';
import { useAppStore } from '../store/useAppStore';
import type { RootStackParamList } from '../navigation/types';

export function TransactionsScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const transactions = useAppStore(state => state.transactions);
  const [filter, setFilter] = useState('全部');
  const visible =
    filter === '全部'
      ? transactions
      : transactions.filter(tx => tx.type.includes(filter));
  const exportData = () =>
    Alert.alert('导出交易记录', `当前筛选：${filter} · 最近 30 天`, [
      { text: '取消', style: 'cancel' },
      {
        text: 'CSV',
        onPress: () =>
          Share.share({ message: 'CryptoPay CSV 导出任务已创建（演示）' }),
      },
      {
        text: 'PDF',
        onPress: () =>
          Share.share({
            message: 'CryptoPay PDF 对账单导出任务已创建（演示）',
          }),
      },
    ]);
  return (
    <Screen>
      <Header
        title="交易记录"
        action={
          <Pressable onPress={exportData}>
            <Download color={colors.ink} />
          </Pressable>
        }
      />
      <View style={styles.filters}>
        {['全部', '充值', '提现', '换币', '付款', '出金'].map(item => (
          <Pressable
            key={item}
            onPress={() => setFilter(item)}
            style={[styles.chip, filter === item && styles.chipActive]}
          >
            <Text
              style={[
                styles.chipText,
                filter === item && styles.chipTextActive,
              ]}
            >
              {item}
            </Text>
          </Pressable>
        ))}
      </View>
      <Card>
        {visible.length ? (
          visible.map((tx, index) => (
            <Pressable
              key={tx.id}
              onPress={() =>
                navigation.navigate('TransactionDetail', { id: tx.id })
              }
              style={[styles.row, index > 0 && styles.line]}
            >
              <View style={styles.icon}>
                <Repeat2 color={colors.primary} />
              </View>
              <View style={styles.grow}>
                <Text style={styles.title}>{tx.type}</Text>
                <Text numberOfLines={1} style={styles.muted}>
                  {tx.counterparty} · {new Date(tx.date).toLocaleDateString()}
                </Text>
              </View>
              <View style={styles.right}>
                <Text style={styles.amount}>
                  {tx.amount > 0 ? '+' : ''}
                  {tx.amount} {tx.asset}
                </Text>
                <StatusBadge status={tx.status} />
              </View>
            </Pressable>
          ))
        ) : (
          <View style={styles.empty}>
            <Text style={styles.title}>暂无交易</Text>
            <Text style={styles.muted}>该筛选条件下没有记录</Text>
          </View>
        )}
      </Card>
    </Screen>
  );
}

export function TransactionDetailScreen({
  route,
}: NativeStackScreenProps<RootStackParamList, 'TransactionDetail'>) {
  const tx = useAppStore(state =>
    state.transactions.find(item => item.id === route.params.id),
  );
  if (!tx)
    return (
      <Screen>
        <Text>交易不存在或尚未同步。</Text>
      </Screen>
    );
  return (
    <Screen>
      <Card style={styles.summary}>
        <View style={styles.bigIcon}>
          <Repeat2 size={32} color={colors.primary} />
        </View>
        <Text style={styles.bigAmount}>
          {tx.amount > 0 ? '+' : ''}
          {tx.amount} {tx.asset}
        </Text>
        <StatusBadge status={tx.status} />
      </Card>
      <Card>
        <Detail label="交易编号" value={tx.id} />
        <Detail label="交易类型" value={tx.type} />
        <Detail label="交易对方" value={tx.counterparty} />
        <Detail label="法币估值" value={`$${tx.fiatAmount.toLocaleString()}`} />
        <Detail label="时间" value={new Date(tx.date).toLocaleString()} />
        <Detail label="网络/参考号" value={tx.hash} />
      </Card>
      <Text style={styles.section}>处理进度</Text>
      <Card>
        <Timeline title="请求已创建" subtitle="身份与请求参数校验完成" done />
        <Timeline title="风控审核" subtitle="KYT/AML 策略检查通过" done />
        <Timeline title="网络确认" subtitle="等待目标网络达到确认数" />
      </Card>
    </Screen>
  );
}
function Detail({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.detail}>
      <Text style={styles.muted}>{label}</Text>
      <Text numberOfLines={2} style={styles.detailValue}>
        {value}
      </Text>
    </View>
  );
}
function Timeline({
  title,
  subtitle,
  done,
}: {
  title: string;
  subtitle: string;
  done?: boolean;
}) {
  return (
    <View style={styles.timeline}>
      <View
        style={[
          styles.timelineDot,
          { backgroundColor: done ? colors.success : colors.warning },
        ]}
      />
      <View>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.muted}>{subtitle}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  filters: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: {
    borderRadius: 18,
    paddingVertical: 8,
    paddingHorizontal: 13,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  chipActive: { backgroundColor: colors.primary },
  chipText: { color: colors.ink },
  chipTextActive: { color: colors.white, fontWeight: '700' },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 12,
  },
  line: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
  },
  icon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  grow: { flex: 1, gap: 4 },
  title: { fontWeight: '800', color: colors.ink },
  muted: { fontSize: 12, color: colors.muted },
  right: { alignItems: 'flex-end', gap: 4 },
  amount: { fontWeight: '800', color: colors.ink },
  empty: { alignItems: 'center', padding: 30, gap: 6 },
  summary: { alignItems: 'center', gap: 12 },
  bigIcon: {
    width: 62,
    height: 62,
    borderRadius: 31,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bigAmount: { fontSize: 25, fontWeight: '900', color: colors.ink },
  detail: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 18,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
  },
  detailValue: {
    flex: 1,
    textAlign: 'right',
    color: colors.ink,
    fontWeight: '600',
  },
  section: { fontSize: 18, fontWeight: '800', color: colors.ink },
  timeline: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 10,
  },
  timelineDot: { width: 12, height: 12, borderRadius: 6 },
});
