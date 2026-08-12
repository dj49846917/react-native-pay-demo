const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');
const {
  withStorybook,
} = require('@storybook/react-native/metro/withStorybook');

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('@react-native/metro-config').MetroConfig}
 */
const storybookEnabled = process.env.STORYBOOK_ENABLED === 'true';
const config = {};

module.exports = withStorybook(
  mergeConfig(getDefaultConfig(__dirname), config),
  {
    enabled: storybookEnabled,
    configPath: './.rnstorybook',
  },
);
