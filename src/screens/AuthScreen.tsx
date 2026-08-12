import React, { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import {
  Building2,
  Eye,
  EyeOff,
  Mail,
  Phone,
  ShieldCheck,
} from 'lucide-react-native';
import { Card, PrimaryButton, Screen, uiStyles } from '../components/ui';
import { colors, radius, spacing } from '../theme';
import { useAppStore } from '../store/useAppStore';
import type { RootStackParamList } from '../navigation/types';

type Mode = 'login' | 'register' | 'forgot';
type Method = 'account' | 'phone';

const schema = z.object({
  company: z.string().optional(),
  email: z.string().optional(),
  password: z.string().optional(),
  phone: z.string().optional(),
  smsCode: z.string().optional(),
});
type FormData = z.infer<typeof schema>;

export function AuthScreen({ mode }: { mode: Mode }) {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const login = useAppStore(state => state.login);
  const [method, setMethod] = useState<Method>('account');
  const [secure, setSecure] = useState(true);
  const [captcha, setCaptcha] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const {
    control,
    handleSubmit,
    setError,
    getValues,
    clearErrors,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      company: '',
      email: '',
      password: '',
      phone: '',
      smsCode: '',
    },
  });

  useEffect(() => {
    if (seconds <= 0) return;
    const timer = setTimeout(() => setSeconds(value => value - 1), 1000);
    return () => clearTimeout(timer);
  }, [seconds]);

  const submit = (values: FormData) => {
    let invalid = false;
    if (mode === 'register' && !values.company?.trim()) {
      setError('company', { message: '请输入企业名称' });
      invalid = true;
    }
    if (method === 'account' || mode !== 'login') {
      if (!/^\S+@\S+\.\S+$/.test(values.email ?? '')) {
        setError('email', { message: '请输入有效邮箱' });
        invalid = true;
      }
      if (mode !== 'forgot' && (values.password?.length ?? 0) < 8) {
        setError('password', { message: '密码至少 8 位' });
        invalid = true;
      }
    } else {
      if (!/^\+?\d{6,15}$/.test(values.phone ?? '')) {
        setError('phone', { message: '请输入有效手机号' });
        invalid = true;
      }
      if (values.smsCode !== '246810') {
        setError('smsCode', { message: '短信验证码不正确' });
        invalid = true;
      }
    }
    if (invalid) return;
    if (mode === 'forgot') {
      navigation.navigate('Login');
      return;
    }
    if (mode === 'register') {
      setCaptcha(true);
      return;
    }
    setCaptcha(true);
  };

  const sendCode = () => {
    const phone = getValues('phone') ?? '';
    if (!/^\+?\d{6,15}$/.test(phone)) {
      setError('phone', { message: '请先输入有效手机号' });
      return;
    }
    clearErrors('phone');
    setSeconds(60);
  };

  const title =
    mode === 'register'
      ? '创建企业账户'
      : mode === 'forgot'
      ? '找回密码'
      : '欢迎回来';
  return (
    <Screen>
      <View style={styles.brand}>
        <View style={styles.logo}>
          <Text style={styles.logoText}>₿</Text>
        </View>
        <Text style={styles.brandText}>CryptoPay</Text>
      </View>
      <View style={styles.intro}>
        <Text style={uiStyles.title}>{title}</Text>
        <Text style={uiStyles.subtitle}>
          {mode === 'forgot'
            ? '输入注册邮箱，我们会发送重置链接。'
            : '安全管理数字资产、付款和审批。'}
        </Text>
      </View>
      {mode === 'login' ? (
        <View style={styles.segments}>
          {(['account', 'phone'] as Method[]).map(value => (
            <Pressable
              key={value}
              onPress={() => {
                setMethod(value);
                clearErrors();
              }}
              style={[styles.segment, method === value && styles.segmentActive]}
            >
              <Text
                style={[
                  styles.segmentText,
                  method === value && styles.segmentTextActive,
                ]}
              >
                {value === 'account' ? '账号密码' : '手机号验证码'}
              </Text>
            </Pressable>
          ))}
        </View>
      ) : null}
      <Card style={styles.form}>
        {mode === 'register' ? (
          <Field
            name="company"
            control={control}
            error={errors.company?.message}
            label="企业名称"
            icon={<Building2 size={19} color={colors.muted} />}
          />
        ) : null}
        {method === 'phone' && mode === 'login' ? (
          <>
            <Field
              name="phone"
              control={control}
              error={errors.phone?.message}
              label="手机号"
              keyboardType="phone-pad"
              icon={<Phone size={19} color={colors.muted} />}
            />
            <View>
              <Text style={uiStyles.label}>短信验证码</Text>
              <View style={styles.codeRow}>
                <Controller
                  name="smsCode"
                  control={control}
                  render={({ field: { onChange, value } }) => (
                    <TextInput
                      testID="sms-code"
                      value={value}
                      onChangeText={onChange}
                      keyboardType="number-pad"
                      maxLength={6}
                      placeholder="6 位验证码"
                      placeholderTextColor={colors.muted}
                      style={[uiStyles.input, styles.codeInput]}
                    />
                  )}
                />
                <Pressable
                  disabled={seconds > 0}
                  onPress={sendCode}
                  style={styles.codeButton}
                >
                  <Text style={styles.codeText}>
                    {seconds > 0 ? `${seconds}s` : '获取验证码'}
                  </Text>
                </Pressable>
              </View>
              {errors.smsCode ? (
                <Text style={uiStyles.error}>{errors.smsCode.message}</Text>
              ) : null}
              <Text style={styles.demoCode}>演示验证码：246810</Text>
            </View>
          </>
        ) : (
          <>
            <Field
              name="email"
              control={control}
              error={errors.email?.message}
              label="工作邮箱"
              keyboardType="email-address"
              autoCapitalize="none"
              icon={<Mail size={19} color={colors.muted} />}
            />
            {mode !== 'forgot' ? (
              <View>
                <Text style={uiStyles.label}>密码</Text>
                <View>
                  <Controller
                    name="password"
                    control={control}
                    render={({ field: { onChange, value } }) => (
                      <TextInput
                        testID="password"
                        value={value}
                        onChangeText={onChange}
                        secureTextEntry={secure}
                        placeholder="至少 8 位"
                        placeholderTextColor={colors.muted}
                        style={uiStyles.input}
                      />
                    )}
                  />
                  <Pressable
                    style={styles.eye}
                    onPress={() => setSecure(value => !value)}
                  >
                    {secure ? (
                      <Eye size={20} color={colors.muted} />
                    ) : (
                      <EyeOff size={20} color={colors.muted} />
                    )}
                  </Pressable>
                </View>
                {errors.password ? (
                  <Text style={uiStyles.error}>{errors.password.message}</Text>
                ) : null}
              </View>
            ) : null}
          </>
        )}
        {mode === 'login' && method === 'account' ? (
          <Pressable onPress={() => navigation.navigate('ForgotPassword')}>
            <Text style={[styles.link, styles.right]}>忘记密码？</Text>
          </Pressable>
        ) : null}
        <PrimaryButton
          testID="login-submit"
          title={
            mode === 'forgot'
              ? '发送重置链接'
              : mode === 'register'
              ? '注册并开始认证'
              : '继续安全验证'
          }
          onPress={() => handleSubmit(submit)()}
        />
      </Card>
      {mode !== 'forgot' ? (
        <View style={styles.footer}>
          <Text>{mode === 'register' ? '已有账户？' : '还没有账户？'}</Text>
          <Pressable
            onPress={() =>
              navigation.navigate(mode === 'register' ? 'Login' : 'Register')
            }
          >
            <Text style={styles.link}>
              {mode === 'register' ? '登录' : '立即注册'}
            </Text>
          </Pressable>
        </View>
      ) : null}
      <CaptchaModal
        visible={captcha}
        onCancel={() => setCaptcha(false)}
        onVerified={() => {
          setCaptcha(false);
          login();
        }}
      />
    </Screen>
  );
}

function Field({
  name,
  control,
  label,
  error,
  icon,
  ...props
}: {
  name: keyof FormData;
  control: ReturnType<typeof useForm<FormData>>['control'];
  label: string;
  error?: string;
  icon: React.ReactNode;
} & React.ComponentProps<typeof TextInput>) {
  return (
    <View>
      <Text style={uiStyles.label}>{label}</Text>
      <View>
        <Controller
          name={name}
          control={control}
          render={({ field: { onChange, value } }) => (
            <TextInput
              value={value ?? ''}
              onChangeText={onChange}
              placeholder={label}
              placeholderTextColor={colors.muted}
              style={[uiStyles.input, styles.iconInput]}
              {...props}
            />
          )}
        />
        <View style={styles.fieldIcon}>{icon}</View>
      </View>
      {error ? <Text style={uiStyles.error}>{error}</Text> : null}
    </View>
  );
}

const captchaItems = ['₿', '🏦', '🐱', '🚗', '₿', '☕', '✈️', '₿', '🏠'];
const correct = [0, 4, 7];
function CaptchaModal({
  visible,
  onCancel,
  onVerified,
}: {
  visible: boolean;
  onCancel: () => void;
  onVerified: () => void;
}) {
  const [selected, setSelected] = useState<number[]>([]);
  const [error, setError] = useState('');
  const verify = () => {
    if (
      selected.length === correct.length &&
      correct.every(index => selected.includes(index))
    ) {
      setSelected([]);
      onVerified();
      return;
    }
    setSelected([]);
    setError(selected.length ? '选择不正确，请重新选择' : '请先选择图片');
  };
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
    >
      <View style={styles.overlay}>
        <Card style={styles.captcha}>
          <View style={styles.captchaHeading}>
            <ShieldCheck color={colors.primary} />
            <Text style={styles.captchaTitle}>安全验证</Text>
          </View>
          <Text style={styles.captchaInstruction}>
            请选择所有包含比特币符号的图片
          </Text>
          <View style={styles.grid}>
            {captchaItems.map((item, index) => {
              const active = selected.includes(index);
              return (
                <Pressable
                  testID={`captcha-${index}`}
                  key={`${item}-${index}`}
                  onPress={() => {
                    setError('');
                    setSelected(value =>
                      active
                        ? value.filter(i => i !== index)
                        : [...value, index],
                    );
                  }}
                  style={[styles.tile, active && styles.tileActive]}
                >
                  <Text style={styles.tileText}>{item}</Text>
                  {active ? (
                    <View style={styles.check}>
                      <Text style={styles.checkText}>✓</Text>
                    </View>
                  ) : null}
                </Pressable>
              );
            })}
          </View>
          {error ? <Text style={uiStyles.error}>{error}</Text> : null}
          <View style={styles.actions}>
            <Pressable onPress={onCancel}>
              <Text style={styles.link}>取消</Text>
            </Pressable>
            <PrimaryButton
              testID="captcha-verify"
              title="验证"
              onPress={verify}
            />
          </View>
        </Card>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  brand: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 24 },
  logo: {
    width: 44,
    height: 44,
    borderRadius: 13,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText: { fontSize: 27, color: colors.white, fontWeight: '800' },
  brandText: { fontSize: 23, fontWeight: '800', color: colors.ink },
  intro: { gap: 7, marginTop: 30 },
  segments: {
    flexDirection: 'row',
    borderRadius: radius.md,
    backgroundColor: colors.primarySoft,
    padding: 4,
  },
  segment: {
    flex: 1,
    padding: 11,
    alignItems: 'center',
    borderRadius: radius.sm,
  },
  segmentActive: { backgroundColor: colors.surface },
  segmentText: { color: colors.muted, fontWeight: '700' },
  segmentTextActive: { color: colors.primary },
  form: { gap: spacing.lg },
  iconInput: { paddingLeft: 44 },
  fieldIcon: { position: 'absolute', left: 14, top: 16 },
  eye: { position: 'absolute', right: 15, top: 16 },
  link: { color: colors.primary, fontWeight: '800' },
  right: { textAlign: 'right' },
  footer: { flexDirection: 'row', justifyContent: 'center', gap: 6 },
  codeRow: { flexDirection: 'row', gap: 9 },
  codeInput: { flex: 1 },
  codeButton: {
    paddingHorizontal: 13,
    justifyContent: 'center',
    backgroundColor: colors.primarySoft,
    borderRadius: radius.md,
  },
  codeText: { color: colors.primary, fontWeight: '700' },
  demoCode: { marginTop: 6, fontSize: 12, color: colors.muted },
  overlay: {
    flex: 1,
    padding: 20,
    backgroundColor: '#0008',
    justifyContent: 'center',
  },
  captcha: { gap: 14, maxWidth: 380, width: '100%', alignSelf: 'center' },
  captchaHeading: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  captchaTitle: { fontSize: 21, fontWeight: '800', color: colors.ink },
  captchaInstruction: { fontWeight: '700', color: colors.ink },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  tile: {
    width: '31%',
    aspectRatio: 1,
    backgroundColor: colors.primarySoft,
    borderRadius: radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: 'transparent',
  },
  tileActive: { borderColor: colors.primary },
  tileText: { fontSize: 32 },
  check: {
    position: 'absolute',
    right: 4,
    top: 4,
    backgroundColor: colors.primary,
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  checkText: { color: colors.white, fontWeight: '800' },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: 20,
  },
});
