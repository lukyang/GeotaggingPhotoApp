import {Navigation} from 'react-native-navigation';

export function registerScreens() {
  Navigation.registerComponent('Map', () => require('./Map').default);
  Navigation.registerComponent('Camera', () => require('./Camera').default);
  Navigation.registerComponent('Signup', () => require('./Signup').default);
  Navigation.registerComponent('Login', () => require('./Login').default);
  Navigation.registerComponent('Loading', () => require('./loading').default);
  Navigation.registerComponent('Drawer', () => require('./Drawer').default);
}