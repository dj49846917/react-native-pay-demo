import React, { useState } from 'react';
import {
  Alert,
  Platform,
  Pressable,
  StyleSheet,
  Switch,
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
  Activity,
  Bell,
  BookOpen,
  Building2,
  ChevronRight,
  Contact,
  Fingerprint,
  HelpCircle,
  Landmark,
  MonitorSmartphone,
  SlidersHorizontal,
  ShieldCheck,
  Users,
} from 'lucide-react-native';
import { campaigns } from '../data/mock';
import {
  Card,
  Header,
  PrimaryButton,
  Screen,
  SectionTitle,
  SecondaryButton,
  uiStyles,
} from '../components/ui';
import { colors, radius } from '../theme';
import { useAppStore } from '../store/useAppStore';
import type { RootStackParamList } from '../navigation/types';

const sections = [
  {
    title: '企业与账户',
    items: [
      ['company', '企业资料与 KYB', Building2],
      ['team', '团队成员与角色', Users],
      ['banks', '银行账户', Landmark],
      ['address-book', '地址簿', Contact],
    ],
  },
  {
    title: '安全',
    items: [
      ['two-factor', '双重认证', ShieldCheck],
      ['biometrics', '生物识别', Fingerprint],
      ['devices', '设备管理', MonitorSmartphone],
      ['policies', '限额与审批策略', SlidersHorizontal],
    ],
  },
  {
    title: '更多',
    items: [
      ['activities', '活动中心', Activity],
      ['notification-settings', '通知设置', Bell],
      ['support', '帮助与支持', HelpCircle],
      ['legal', '关于与法律条款', BookOpen],
    ],
  },
] as const;

export function ProfileScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const logout = useAppStore(state => state.logout);
  return (
    <Screen>
      <Header title="用户中心" />
      <Card style={styles.profile}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>AC</Text>
        </View>
        <View style={styles.grow}>
          <Text style={styles.name}>Alice Chen</Text>
          <Text style={styles.muted}>Northstar Trading Ltd.</Text>
        </View>
        <View style={styles.verified}>
          <Text style={styles.verifiedText}>KYB 已认证</Text>
        </View>
      </Card>
      {sections.map(section => (
        <View key={section.title}>
          <SectionTitle title={section.title} />
          <Card style={styles.menu}>
            {section.items.map(([key, title, Icon], index) => (
              <Pressable
                key={key}
                onPress={() =>
                  key === 'activities'
                    ? navigation.navigate('Activities')
                    : navigation.navigate('ProfileSection', {
                        section: key,
                        title,
                      })
                }
                style={[styles.menuItem, index > 0 && styles.line]}
              >
                <Icon color={colors.primary} size={21} />
                <Text style={styles.menuText}>{title}</Text>
                <ChevronRight color={colors.muted} size={20} />
              </Pressable>
            ))}
          </Card>
        </View>
      ))}
      <SecondaryButton
        title="退出登录"
        onPress={() =>
          Alert.alert('退出登录？', '需要重新验证后才能访问企业账户。', [
            { text: '取消', style: 'cancel' },
            { text: '退出', style: 'destructive', onPress: logout },
          ])
        }
      />
      <Text style={styles.version}>CryptoPay RN 1.0.0 · React Native 0.87</Text>
    </Screen>
  );
}

export function ActivitiesScreen() {
  return (
    <Screen>
      <View style={styles.reward}>
        <Text style={styles.rewardTitle}>CryptoPay Rewards</Text>
        <Text style={styles.rewardSubtitle}>完成任务，解锁企业专属奖励</Text>
      </View>
      {campaigns.map(item => (
        <Card key={item.id} style={styles.campaign}>
          <Text style={styles.name}>{item.title}</Text>
          <Text style={styles.muted}>{item.description}</Text>
          <View style={styles.track}>
            <View
              style={[styles.progress, { width: `${item.progress * 100}%` }]}
            />
          </View>
          <View style={styles.heading}>
            <Text>
              {Math.round(item.progress * 100)}% · {item.endsAt}
            </Text>
            <Text style={styles.link}>奖励 {item.reward}</Text>
          </View>
          <PrimaryButton
            title={item.progress >= 1 ? '领取奖励' : '继续完成任务'}
            onPress={() => Alert.alert('活动任务', item.description)}
          />
        </Card>
      ))}
    </Screen>
  );
}

const entityData: Record<string, Array<[string, string]>> = {
  team: [
    ['Alice Chen', 'alice@northstar.demo · 管理员'],
    ['Marcus Lee', 'marcus@northstar.demo · 审批人'],
    ['Sofia Wong', 'sofia@northstar.demo · 操作员'],
  ],
  banks: [
    ['HSBC Hong Kong', 'USD · •••• 8841'],
    ['DBS Bank', 'SGD · •••• 1208'],
  ],
  'address-book': [
    ['Treasury Wallet', 'USDT-TRC20 · TX8p...2mk9'],
    ['Vendor Alpha', 'USDC-ERC20 · 0x71...c74d'],
  ],
  devices: [
    ['iPhone 17 Pro', '当前设备 · 上海 · 刚刚活跃'],
    ['Chrome on macOS', '上海 · 2 小时前'],
  ],
};

export function ProfileSectionScreen({
  route,
}: NativeStackScreenProps<RootStackParamList, 'ProfileSection'>) {
  const section = route.params.section;
  const [enabled, setEnabled] = useState(true);
  const [secondary, setSecondary] = useState(false);
  const [limit, setLimit] = useState('50000');
  const [entities, setEntities] = useState(entityData[section] ?? []);
  const save = () => Alert.alert('保存成功', '设置已保存在本机演示数据中。');
  if (section === 'company')
    return (
      <Screen>
        <Card style={styles.form}>
          <View style={styles.kyb}>
            <ShieldCheck color={colors.success} />
            <View>
              <Text style={styles.name}>KYB 已通过</Text>
              <Text style={styles.muted}>复审日期：2027-06-30</Text>
            </View>
          </View>
          <Input label="企业名称" value="Northstar Trading Ltd." />
          <Input label="注册编号" value="HK-CR-882014" editable={false} />
          <Input label="注册地址" value="Central, Hong Kong" />
          <Input label="业务类型" value="Digital commerce" />
        </Card>
        <PrimaryButton title="保存企业资料" onPress={save} />
      </Screen>
    );
  if (['team', 'banks', 'address-book', 'devices'].includes(section))
    return (
      <Screen>
        <Card style={styles.menu}>
          {entities.map((item, index) => (
            <Pressable
              key={item[0]}
              onPress={() =>
                Alert.alert(item[0], item[1], [
                  {
                    text:
                      section === 'devices' && index > 0 ? '移除设备' : '编辑',
                    style: section === 'devices' ? 'destructive' : 'default',
                    onPress: () =>
                      section === 'devices' &&
                      setEntities(value =>
                        value.filter(entry => entry !== item),
                      ),
                  },
                  { text: '关闭' },
                ])
              }
              style={[styles.entity, index > 0 && styles.line]}
            >
              <View style={styles.grow}>
                <Text style={styles.name}>{item[0]}</Text>
                <Text style={styles.muted}>{item[1]}</Text>
              </View>
              <ChevronRight color={colors.muted} />
            </Pressable>
          ))}
        </Card>
        {section !== 'devices' ? (
          <PrimaryButton
            title={
              section === 'team'
                ? '邀请成员'
                : section === 'banks'
                ? '添加银行账户'
                : '添加钱包地址'
            }
            onPress={() =>
              setEntities(value => [...value, ['新建项目', '等待验证（演示）']])
            }
          />
        ) : (
          <Text style={styles.muted}>
            移除设备后，该设备的本地登录令牌将失效。
          </Text>
        )}
      </Screen>
    );
  if (section === 'two-factor')
    return (
      <Screen>
        <Card>
          <Setting
            title="Authenticator 动态验证码"
            subtitle={enabled ? '已启用 · 上次验证 2 小时前' : '当前未启用'}
            value={enabled}
            onChange={setEnabled}
          />
          <Pressable
            onPress={() =>
              Alert.alert(
                '恢复代码',
                'CPAY-18D4-92KF\nCPAY-73LM-20QX\nCPAY-55AA-81VT',
              )
            }
            style={[styles.menuItem, styles.line]}
          >
            <Text style={styles.menuText}>查看恢复代码</Text>
            <ChevronRight color={colors.muted} />
          </Pressable>
        </Card>
      </Screen>
    );
  if (section === 'biometrics')
    return (
      <Screen>
        <Card>
          <Setting
            title="使用 Face ID / 指纹"
            subtitle="用于登录及确认高风险资金操作"
            value={enabled}
            onChange={setEnabled}
          />
        </Card>
      </Screen>
    );
  if (section === 'policies')
    return (
      <Screen>
        <Card style={styles.form}>
          <Input
            label="单日付款限额（USD）"
            value={limit}
            onChangeText={setLimit}
            keyboardType="decimal-pad"
          />
          <Setting
            title="大额付款需要双人审批"
            subtitle="金额超过 10,000 USDT 时生效"
            value={enabled}
            onChange={setEnabled}
          />
          <Setting
            title="审批有效期提醒"
            subtitle="请求到期前 2 小时提醒"
            value={secondary}
            onChange={setSecondary}
          />
        </Card>
        <PrimaryButton title="保存审批策略" onPress={save} />
      </Screen>
    );
  if (section === 'notification-settings')
    return (
      <Screen>
        <Card>
          <Setting
            title="邮件通知"
            subtitle="发送到 alice@northstar.demo"
            value={enabled}
            onChange={setEnabled}
          />
          <Setting
            title="推送通知"
            subtitle="发送到已登录设备"
            value={secondary}
            onChange={setSecondary}
          />
          <Setting
            title="交易和审批状态"
            subtitle="到账、失败与待审批提醒"
            value
            onChange={() => {}}
          />
        </Card>
      </Screen>
    );
  if (section === 'support')
    return (
      <Screen>
        <Card>
          {[
            '充值多久可以到账？',
            '提现为什么需要审批？',
            '如何添加新的审批人？',
          ].map(question => (
            <Pressable
              key={question}
              onPress={() =>
                Alert.alert(
                  question,
                  '这是演示帮助内容。生产环境将连接知识库和客服系统。',
                )
              }
              style={styles.menuItem}
            >
              <Text style={styles.menuText}>{question}</Text>
              <ChevronRight color={colors.muted} />
            </Pressable>
          ))}
        </Card>
        <PrimaryButton
          title="联系客户支持"
          onPress={() => {
            if (Platform.OS === 'ios') {
              Alert.prompt('创建支持工单', '请描述遇到的问题', () =>
                Alert.alert('提交成功', '工单 CP-20260812 已创建（演示）'),
              );
              return;
            }
            Alert.alert('创建支持工单', '工单 CP-20260812 已创建（演示）');
          }}
        />
      </Screen>
    );
  return (
    <Screen>
      <Card>
        <View style={styles.about}>
          <Text style={styles.aboutLogo}>₿</Text>
          <Text style={styles.name}>CryptoPay React Native</Text>
          <Text style={styles.muted}>版本 1.0.0 · React Native 0.87</Text>
        </View>
        {['服务条款', '隐私政策', '风险披露', '开源软件许可'].map(item => (
          <Pressable
            key={item}
            onPress={() =>
              Alert.alert(
                item,
                '这是演示文本。生产发布前应由法务与合规团队提供正式版本。',
              )
            }
            style={[styles.menuItem, styles.line]}
          >
            <Text style={styles.menuText}>{item}</Text>
            <ChevronRight color={colors.muted} />
          </Pressable>
        ))}
      </Card>
      <Text style={styles.version}>
        本工程为产品演示，不提供真实托管、交易或投资服务。
      </Text>
    </Screen>
  );
}

function Input({
  label,
  ...props
}: { label: string } & React.ComponentProps<typeof TextInput>) {
  const [value, setValue] = useState(String(props.value ?? ''));
  return (
    <View>
      <Text style={uiStyles.label}>{label}</Text>
      <TextInput
        {...props}
        value={props.onChangeText ? props.value : value}
        onChangeText={props.onChangeText ?? setValue}
        placeholderTextColor={colors.muted}
        style={uiStyles.input}
      />
    </View>
  );
}
function Setting({
  title,
  subtitle,
  value,
  onChange,
}: {
  title: string;
  subtitle: string;
  value: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <View style={styles.setting}>
      <View style={styles.grow}>
        <Text style={styles.name}>{title}</Text>
        <Text style={styles.muted}>{subtitle}</Text>
      </View>
      <Switch
        value={value}
        onValueChange={onChange}
        trackColor={{ true: colors.primary }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  profile: { flexDirection: 'row', alignItems: 'center', gap: 13 },
  avatar: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { color: colors.white, fontSize: 18, fontWeight: '900' },
  grow: { flex: 1 },
  name: { fontSize: 16, fontWeight: '900', color: colors.ink },
  muted: { color: colors.muted, lineHeight: 20 },
  verified: {
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: radius.pill,
    backgroundColor: '#E7F8EF',
  },
  verifiedText: { fontSize: 11, color: colors.success, fontWeight: '800' },
  menu: { paddingVertical: 3 },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 54,
    gap: 12,
  },
  menuText: { flex: 1, color: colors.ink, fontWeight: '700' },
  line: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
  },
  version: { textAlign: 'center', color: colors.muted },
  reward: {
    height: 150,
    borderRadius: radius.lg,
    padding: 22,
    backgroundColor: colors.primary,
    gap: 8,
  },
  rewardTitle: { fontSize: 23, color: colors.white, fontWeight: '900' },
  rewardSubtitle: { color: '#FFFFFFB3' },
  campaign: { gap: 12 },
  track: {
    height: 9,
    borderRadius: 5,
    backgroundColor: colors.border,
    overflow: 'hidden',
  },
  progress: { height: 9, backgroundColor: colors.secondary },
  heading: { flexDirection: 'row', justifyContent: 'space-between' },
  link: { color: colors.primary, fontWeight: '800' },
  form: { gap: 16 },
  kyb: { flexDirection: 'row', gap: 12, alignItems: 'center' },
  entity: { flexDirection: 'row', alignItems: 'center', minHeight: 66 },
  setting: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    gap: 12,
  },
  about: { alignItems: 'center', gap: 7, paddingVertical: 16 },
  aboutLogo: {
    width: 58,
    height: 58,
    borderRadius: 18,
    color: colors.white,
    backgroundColor: colors.primary,
    fontSize: 34,
    lineHeight: 58,
    textAlign: 'center',
    fontWeight: '900',
  },
});
