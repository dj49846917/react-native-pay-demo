import type { Meta, StoryObj } from '@storybook/react-native';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Card, DemoNotice, PrimaryButton, StatusBadge } from './ui';

const meta = {
  title: 'CryptoPay/Shared UI',
  component: Card,
  decorators: [
    Story => (
      <View style={styles.container}>
        <Story />
      </View>
    ),
  ],
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Buttons: Story = {
  render: () => <PrimaryButton title="提交审批" onPress={() => {}} />,
};

export const Statuses: Story = {
  render: () => (
    <View style={styles.statuses}>
      <StatusBadge status="completed" />
      <StatusBadge status="pending" />
      <StatusBadge status="rejected" />
    </View>
  ),
};

export const DemoEnvironment: Story = {
  render: () => <DemoNotice />,
};

const styles = StyleSheet.create({
  container: { padding: 20, gap: 14 },
  statuses: { gap: 10, alignItems: 'flex-start' },
});
