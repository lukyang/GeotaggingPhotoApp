import {Navigation} from 'react-native-navigation';

export function registerScreens() {
  Navigation.registerComponent('Map', () => require('./Map').default);
  Navigation.registerComponent('Camera', () => require('./Camera').default);
}