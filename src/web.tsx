import 'react-native-gesture-handler';
import { AppRegistry } from 'react-native';
import App from '../App';
import { name as appName } from '../app.json';
import './web.css';

const rootTag = document.getElementById('root');

if (!rootTag) {
  throw new Error('Missing #root element');
}

AppRegistry.registerComponent(appName, () => App);
AppRegistry.runApplication(appName, {
  // React Native Web accepts HTMLElement; React Native's native-only type is opaque.
  rootTag: rootTag as unknown as Parameters<
    typeof AppRegistry.runApplication
  >[1]['rootTag'],
  initialProps: {},
});
