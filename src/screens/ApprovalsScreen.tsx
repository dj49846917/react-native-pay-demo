import React, { useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { Filter, ShieldCheck } from 'lucide-react-native';
import {
  Card,
  Header,
  PrimaryButton,
  Screen,
  SecondaryButton,
} from '../components/ui';
import { colors, radius } from '../theme';
import { useAppStore } from '../store/useAppStore';
import type { ApprovalItem } from '../types';

export function ApprovalsScreen() {
  const approvals = useAppStore(state => state.approvals);
  const handleApproval = useAppStore(state => state.handleApproval);
  const [filter, setFilter] = useState('全部');
  const items =
    filter === '大额'
      ? approvals.filter(item => item.amount >= 10000)
      : filter === '我的申请'
      ? approvals.filter(item => item.requester === 'Alice Chen')
      : approvals;
  const chooseFilter = () =>
    Alert.alert(
      '筛选审批',
      '选择要显示的请求',
      ['全部', '大额', '我的申请', '取消'].map(text => ({
        text,
        style: text === '取消' ? ('cancel' as const) : ('default' as const),
        onPress: () => text !== '取消' && setFilter(text),
      })),
    );
  const confirm = (item: ApprovalItem, approve: boolean) =>
    Alert.alert(
      approve ? '确认批准？' : '确认拒绝？',
      approve
        ? '批准后请求将继续执行，高风险交易可能仍需二次审批。'
        : '拒绝后请求不会执行，并将通知申请人。',
      [
        { text: '取消', style: 'cancel' },
        {
          text: '确认',
          style: approve ? 'default' : 'destructive',
          onPress: () => handleApproval(item.id),
        },
      ],
    );
  return (
    <Screen>
      <Header
        title="审批中心"
        action={
          <Pressable onPress={chooseFilter}>
            <Filter color={filter === '全部' ? colors.ink : colors.primary} />
          </Pressable>
        }
      />
      <View style={styles.banner}>
        <ShieldCheck color={colors.warning} size={32} />
        <View>
          <Text style={styles.bannerTitle}>
            {items.length} 项待处理 · {filter}
          </Text>
          <Text style={styles.muted}>请在付款窗口结束前完成审批</Text>
        </View>
      </View>
      {items.length ? (
        items.map(item => (
          <Card key={item.id} style={styles.card}>
            <View style={styles.heading}>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.muted}>{item.id}</Text>
            </View>
            <Text style={styles.muted}>
              {item.requester} · {new Date(item.createdAt).toLocaleString()}
            </Text>
            <Text style={styles.amount}>
              {item.amount.toFixed(2)} {item.asset}
            </Text>
            <Pressable
              onPress={() =>
                Alert.alert(
                  item.title,
                  `审批编号：${item.id}\n申请人：${item.requester}\n风控结果：检查通过`,
                )
              }
            >
              <Text style={styles.link}>查看审批详情</Text>
            </Pressable>
            <View style={styles.actions}>
              <View style={styles.flex}>
                <SecondaryButton
                  title="拒绝"
                  onPress={() => confirm(item, false)}
                />
              </View>
              <View style={styles.flex}>
                <PrimaryButton
                  title="批准"
                  onPress={() => confirm(item, true)}
                />
              </View>
            </View>
          </Card>
        ))
      ) : (
        <Card style={styles.empty}>
          <Text style={styles.title}>暂无待审批请求</Text>
          <Text style={styles.muted}>可以切换筛选条件查看其他请求。</Text>
        </Card>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  banner: {
    padding: 18,
    borderRadius: radius.lg,
    backgroundColor: '#FFF7E8',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  bannerTitle: { fontSize: 18, fontWeight: '900', color: colors.ink },
  muted: { color: colors.muted, lineHeight: 20 },
  card: { gap: 10 },
  heading: { flexDirection: 'row', justifyContent: 'space-between' },
  title: { fontSize: 17, fontWeight: '900', color: colors.ink },
  amount: {
    fontSize: 25,
    fontWeight: '900',
    color: colors.ink,
    marginVertical: 7,
  },
  link: { color: colors.primary, fontWeight: '800' },
  actions: { flexDirection: 'row', gap: 12, marginTop: 6 },
  flex: { flex: 1 },
  empty: { alignItems: 'center', paddingVertical: 30, gap: 8 },
});
