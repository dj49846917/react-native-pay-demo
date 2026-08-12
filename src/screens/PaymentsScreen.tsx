import React, { useMemo, useState } from 'react';
import {
  Alert,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import type {
  NativeStackNavigationProp,
  NativeStackScreenProps,
} from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import {
  ArrowUpFromLine,
  Building2,
  CirclePlus,
  FileText,
  List,
  Repeat2,
} from 'lucide-react-native';
import Svg, { Rect } from 'react-native-svg';
import { assets } from '../data/mock';
import {
  Card,
  DemoNotice,
  Header,
  PrimaryButton,
  Screen,
  SectionTitle,
  SecondaryButton,
  uiStyles,
} from '../components/ui';
import { colors, radius } from '../theme';
import type { RootStackParamList } from '../navigation/types';
import type { OperationType } from '../types';
import { useAppStore } from '../store/useAppStore';

const meta: Record<
  OperationType,
  {
    title: string;
    description: string;
    icon: React.ComponentType<{ color?: string; size?: number }>;
  }
> = {
  deposit: { title: '充值', description: '获取链上充值地址', icon: CirclePlus },
  withdraw: {
    title: '提现',
    description: '发送资产到外部钱包',
    icon: ArrowUpFromLine,
  },
  swap: { title: '换币', description: '实时询价并兑换资产', icon: Repeat2 },
  invoice: {
    title: 'Invoice',
    description: '创建并跟踪收款账单',
    icon: FileText,
  },
  offramp: {
    title: '法币出金',
    description: '结算至企业银行账户',
    icon: Building2,
  },
  batch: { title: '批量付款', description: '上传文件批量发起付款', icon: List },
};

export function PaymentsScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  return (
    <Screen>
      <Header title="资金管理" />
      <DemoNotice />
      <SectionTitle title="资金操作" />
      <View style={styles.grid}>
        {(Object.keys(meta) as OperationType[]).map(type => {
          const item = meta[type];
          const Icon = item.icon;
          return (
            <Pressable
              key={type}
              onPress={() => navigation.navigate('Operation', { type })}
              style={styles.operation}
            >
              <Icon color={colors.primary} />
              <View>
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.muted}>{item.description}</Text>
              </View>
            </Pressable>
          );
        })}
      </View>
      <SectionTitle title="可用余额" />
      <Card>
        {assets.map((asset, index) => (
          <View
            key={asset.symbol}
            style={[styles.asset, index > 0 && styles.line]}
          >
            <View>
              <Text style={styles.title}>{asset.symbol}</Text>
              <Text style={styles.muted}>{asset.name}</Text>
            </View>
            <Text style={styles.title}>{asset.amount.toFixed(4)}</Text>
          </View>
        ))}
      </Card>
    </Screen>
  );
}

export function OperationScreen({
  route,
  navigation,
}: NativeStackScreenProps<RootStackParamList, 'Operation'>) {
  const type = route.params.type;
  const item = meta[type];
  const createOperation = useAppStore(state => state.createOperation);
  const [asset, setAsset] = useState('USDT');
  const [target, setTarget] = useState('USDC');
  const [amount, setAmount] = useState('');
  const [destination, setDestination] = useState('');
  const [network, setNetwork] = useState('Ethereum');
  const [file, setFile] = useState('');
  const [quote, setQuote] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const address = '0x71bc9e2f7d39a3e8c8f43a2c74df';
  const numericAmount = Number(amount);
  const quoted = useMemo(
    () => (numericAmount * 0.9985).toFixed(4),
    [numericAmount],
  );

  const submit = () => {
    const next: Record<string, string> = {};
    if (!(numericAmount > 0)) next.amount = '请输入有效金额';
    if (!['deposit', 'swap', 'offramp'].includes(type) && !destination.trim())
      next.destination = '此项必填';
    if (
      type === 'invoice' &&
      destination &&
      !/^\S+@\S+\.\S+$/.test(destination)
    )
      next.destination = '请输入有效客户邮箱';
    if (type === 'batch' && !file) next.file = '请先选择付款文件';
    setErrors(next);
    if (Object.keys(next).length) return;
    if (type === 'swap' && !quote) {
      setQuote(true);
      return;
    }
    Alert.alert('确认提交？', `${item.title}请求将进入风控和企业审批流程。`, [
      { text: '返回检查', style: 'cancel' },
      {
        text: '确认提交',
        onPress: () => {
          createOperation(type, asset, numericAmount);
          setSubmitted(true);
        },
      },
    ]);
  };

  if (submitted)
    return (
      <Screen>
        <Card style={styles.success}>
          <Text style={styles.successIcon}>✓</Text>
          <Text style={styles.successTitle}>{item.title}请求已创建</Text>
          <Text style={styles.centerMuted}>
            请求已进入风控与审批流程，可在交易记录或审批中心跟踪。
          </Text>
          <PrimaryButton
            title="查看交易记录"
            onPress={() =>
              navigation.navigate('Main', { screen: 'Transactions' })
            }
          />
        </Card>
      </Screen>
    );
  if (type === 'deposit')
    return (
      <Screen>
        <Header title={item.title} />
        <DemoNotice />
        <Card style={styles.form}>
          <Select
            label="资产"
            values={['USDT', 'USDC', 'BTC', 'ETH']}
            value={asset}
            onChange={setAsset}
          />
          <Select
            label="充值网络"
            values={['Ethereum', 'Tron', 'Bitcoin', 'Solana']}
            value={network}
            onChange={setNetwork}
          />
          <View style={styles.qr}>
            <FakeQr />
            <Text selectable style={styles.address}>
              {address}
            </Text>
          </View>
          <SecondaryButton
            title="复制充值地址"
            onPress={() => Alert.alert('已复制', address)}
          />
          <Text style={styles.warning}>
            仅向此地址充值所选资产。错误网络或资产可能无法找回。
          </Text>
        </Card>
      </Screen>
    );

  return (
    <Screen>
      <Header title={item.title} />
      <DemoNotice />
      <Card style={styles.form}>
        <Select
          label="资产"
          values={['USDT', 'USDC', 'BTC', 'ETH']}
          value={asset}
          onChange={value => {
            setAsset(value);
            if (value === target) setTarget(value === 'USDT' ? 'USDC' : 'USDT');
            setQuote(false);
          }}
        />
        <Field
          label={type === 'invoice' ? 'Invoice 金额' : '金额'}
          value={amount}
          onChangeText={value => {
            setAmount(value);
            setQuote(false);
          }}
          keyboardType="decimal-pad"
          error={errors.amount}
        />
        {type === 'swap' ? (
          <Select
            label="目标资产"
            values={['USDT', 'USDC', 'BTC', 'ETH'].filter(
              value => value !== asset,
            )}
            value={target}
            onChange={value => {
              setTarget(value);
              setQuote(false);
            }}
          />
        ) : type === 'offramp' ? (
          <Select
            label="收款银行账户"
            values={['HSBC •• 8841', 'DBS •• 1208']}
            value={destination || 'HSBC •• 8841'}
            onChange={setDestination}
          />
        ) : (
          <Field
            label={
              type === 'invoice'
                ? '客户邮箱'
                : type === 'batch'
                ? '付款批次名称'
                : '目标钱包地址'
            }
            value={destination}
            onChangeText={setDestination}
            keyboardType={type === 'invoice' ? 'email-address' : 'default'}
            error={errors.destination}
          />
        )}{' '}
        {type === 'batch' ? (
          <>
            <SecondaryButton
              title={file || '上传 CSV/XLSX 付款文件'}
              onPress={() =>
                Alert.alert('选择付款文件', '演示环境使用内置样例文件', [
                  {
                    text: 'vendor-payments.csv',
                    onPress: () => setFile('vendor-payments.csv'),
                  },
                  {
                    text: 'payroll.xlsx',
                    onPress: () => setFile('payroll.xlsx'),
                  },
                  { text: '取消', style: 'cancel' },
                ])
              }
            />
            {errors.file ? (
              <Text style={uiStyles.error}>{errors.file}</Text>
            ) : null}
          </>
        ) : null}
        <View style={styles.fee}>
          <Text>预计费用</Text>
          <Text style={styles.muted}>
            {quote ? '0.15% · 报价 15 秒有效' : '提交后自动询价'}
          </Text>
        </View>
        {quote ? (
          <View style={styles.quote}>
            <Text style={styles.title}>
              报价：{amount} {asset} ≈ {quoted} {target}
            </Text>
          </View>
        ) : null}
        <PrimaryButton
          title={
            type === 'swap' ? (quote ? '确认兑换' : '获取实时报价') : '提交审批'
          }
          onPress={submit}
        />
      </Card>
    </Screen>
  );
}

function Field({
  label,
  error,
  ...props
}: { label: string; error?: string } & React.ComponentProps<typeof TextInput>) {
  return (
    <View>
      <Text style={uiStyles.label}>{label}</Text>
      <TextInput
        placeholder={label}
        placeholderTextColor={colors.muted}
        style={uiStyles.input}
        {...props}
      />
      {error ? <Text style={uiStyles.error}>{error}</Text> : null}
    </View>
  );
}
function Select({
  label,
  values,
  value,
  onChange,
}: {
  label: string;
  values: string[];
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <View>
      <Text style={uiStyles.label}>{label}</Text>
      <View style={styles.options}>
        {values.map(item => (
          <Pressable
            key={item}
            onPress={() => onChange(item)}
            style={[styles.option, value === item && styles.optionActive]}
          >
            <Text
              style={[
                styles.optionText,
                value === item && styles.optionTextActive,
              ]}
            >
              {item}
            </Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}
function FakeQr() {
  const cells = Array.from(
    { length: 49 },
    (_, index) => (index * 17 + index * index) % 5 < 2,
  );
  return (
    <Svg width={180} height={180} viewBox="0 0 70 70">
      <Rect width="70" height="70" fill="white" />
      {cells.map((filled, index) =>
        filled ? (
          <Rect
            key={index}
            x={(index % 7) * 10}
            y={Math.floor(index / 7) * 10}
            width="8"
            height="8"
            fill={colors.ink}
          />
        ) : null,
      )}
    </Svg>
  );
}

const styles = StyleSheet.create({
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  operation: {
    width: '48%',
    minHeight: 130,
    padding: 16,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    justifyContent: 'space-between',
  },
  title: { fontWeight: '800', color: colors.ink },
  muted: { fontSize: 12, lineHeight: 18, color: colors.muted },
  asset: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  line: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
  },
  form: { gap: 16 },
  options: { flexDirection: 'row', flexWrap: 'wrap', gap: 7 },
  option: {
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  optionActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  optionText: { color: colors.ink },
  optionTextActive: { color: colors.white, fontWeight: '700' },
  fee: { flexDirection: 'row', justifyContent: 'space-between' },
  quote: { padding: 14, backgroundColor: '#EAF8F1', borderRadius: radius.md },
  qr: { alignItems: 'center', gap: 10 },
  address: { textAlign: 'center', color: colors.ink },
  warning: { color: colors.warning, textAlign: 'center', lineHeight: 20 },
  success: { alignItems: 'center', gap: 16, paddingVertical: 32 },
  successIcon: {
    width: 66,
    height: 66,
    borderRadius: 33,
    backgroundColor: colors.success,
    color: colors.white,
    textAlign: 'center',
    lineHeight: 66,
    fontSize: 34,
    fontWeight: '900',
  },
  successTitle: { fontSize: 22, fontWeight: '900', color: colors.ink },
  centerMuted: { textAlign: 'center', color: colors.muted, lineHeight: 22 },
});
