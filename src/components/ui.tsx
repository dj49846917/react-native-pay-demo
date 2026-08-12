import type { PropsWithChildren, ReactNode } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  type PressableProps,
  type StyleProp,
  type TextStyle,
  type ViewStyle,
} from 'react-native';
import { ShieldCheck } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, radius, spacing } from '../theme';
import type { TransactionStatus } from '../types';

export function Screen({
  children,
  scroll = true,
}: PropsWithChildren<{ scroll?: boolean }>) {
  const content = scroll ? (
    <ScrollView
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
    >
      {children}
    </ScrollView>
  ) : (
    <View style={[styles.content, styles.flex]}>{children}</View>
  );
  return <SafeAreaView style={styles.safe}>{content}</SafeAreaView>;
}

export function Card({
  children,
  style,
}: PropsWithChildren<{ style?: StyleProp<ViewStyle> }>) {
  return <View style={[styles.card, style]}>{children}</View>;
}

export function PrimaryButton({
  title,
  disabled,
  ...props
}: PressableProps & { title: string }) {
  return (
    <Pressable
      disabled={disabled}
      style={({ pressed }) => [
        styles.primaryButton,
        pressed && styles.pressed,
        disabled && styles.disabled,
      ]}
      {...props}
    >
      <Text style={styles.primaryButtonText}>{title}</Text>
    </Pressable>
  );
}

export function SecondaryButton({
  title,
  ...props
}: PressableProps & { title: string }) {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.secondaryButton,
        pressed && styles.pressed,
      ]}
      {...props}
    >
      <Text style={styles.secondaryButtonText}>{title}</Text>
    </Pressable>
  );
}

export function Header({
  title,
  action,
}: {
  title: string;
  action?: ReactNode;
}) {
  return (
    <View style={styles.header}>
      <Text style={styles.headerTitle}>{title}</Text>
      {action}
    </View>
  );
}

export function SectionTitle({
  title,
  action,
  onAction,
}: {
  title: string;
  action?: string;
  onAction?: () => void;
}) {
  return (
    <View style={styles.sectionRow}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {action ? (
        <Pressable onPress={onAction}>
          <Text style={styles.link}>{action}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

export function DemoNotice() {
  return (
    <View style={styles.notice}>
      <ShieldCheck color={colors.warning} size={22} />
      <Text style={styles.noticeText}>
        演示环境：资金操作不会广播至链上或银行网络。
      </Text>
    </View>
  );
}

export function StatusBadge({ status }: { status: TransactionStatus }) {
  const values: Record<
    TransactionStatus,
    [string, StyleProp<ViewStyle>, StyleProp<TextStyle>]
  > = {
    completed: ['已完成', styles.badgeCompleted, styles.textCompleted],
    pending: ['处理中', styles.badgePending, styles.textPending],
    rejected: ['已拒绝', styles.badgeRejected, styles.textRejected],
  };
  const value = values[status];
  return (
    <View style={[styles.badge, value[1]]}>
      <Text style={[styles.badgeText, value[2]]}>{value[0]}</Text>
    </View>
  );
}

export const uiStyles = StyleSheet.create({
  title: { fontSize: 28, lineHeight: 34, fontWeight: '800', color: colors.ink },
  subtitle: { fontSize: 15, lineHeight: 22, color: colors.muted },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    paddingHorizontal: 14,
    height: 52,
    color: colors.ink,
    fontSize: 16,
  },
  error: { color: colors.danger, fontSize: 12, marginTop: 5 },
  label: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.ink,
    marginBottom: 7,
  },
  row: { flexDirection: 'row', alignItems: 'center' },
  divider: { height: StyleSheet.hairlineWidth, backgroundColor: colors.border },
});

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  flex: { flex: 1 },
  content: { padding: spacing.lg, paddingBottom: 40, gap: spacing.md },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    shadowColor: '#111827',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.06,
    shadowRadius: 14,
    elevation: 2,
  },
  primaryButton: {
    height: 50,
    borderRadius: radius.md,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 18,
  },
  primaryButtonText: { color: colors.white, fontWeight: '800', fontSize: 15 },
  secondaryButton: {
    height: 48,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 18,
  },
  secondaryButtonText: { color: colors.primary, fontWeight: '800' },
  pressed: { opacity: 0.72 },
  disabled: { opacity: 0.45 },
  header: {
    minHeight: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTitle: { fontSize: 25, fontWeight: '800', color: colors.ink },
  sectionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 6,
  },
  sectionTitle: { fontSize: 18, fontWeight: '800', color: colors.ink },
  link: { color: colors.primary, fontWeight: '700' },
  notice: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
    padding: 12,
    borderRadius: radius.md,
    backgroundColor: '#FFF7E8',
  },
  noticeText: { flex: 1, color: colors.ink, lineHeight: 20 },
  badge: {
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: radius.pill,
    alignSelf: 'flex-start',
  },
  badgeText: { fontWeight: '700', fontSize: 12 },
  badgeCompleted: { backgroundColor: '#16A66A1F' },
  badgePending: { backgroundColor: '#E59D201F' },
  badgeRejected: { backgroundColor: '#DC4C641F' },
  textCompleted: { color: colors.success },
  textPending: { color: colors.warning },
  textRejected: { color: colors.danger },
});
