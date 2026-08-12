/**
 * @format
 */

import { AppRegistry } from 'react-native';
import 'react-native-gesture-handler';
import { name as appName } from './app.json';

const Root =
  process.env.STORYBOOK_ENABLED === 'true'
    ? require('./.rnstorybook').default
    : require('./App').default;

AppRegistry.registerComponent(appName, () => Root);
