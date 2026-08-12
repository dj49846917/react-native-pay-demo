/* eslint-env jest */

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(() => Promise.resolve(null)),
  setItem: jest.fn(() => Promise.resolve()),
  removeItem: jest.fn(() => Promise.resolve()),
  clear: jest.fn(() => Promise.resolve()),
}));

jest.mock('react-native-gesture-handler', () => ({}));

jest.mock('lucide-react-native', () => {
  const {View} = require('react-native');
  return new Proxy({}, {get: () => View});
});
