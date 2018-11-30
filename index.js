import { Navigation } from "react-native-navigation";
import {registerScreens} from './src/Screens';

registerScreens();

Navigation.events().registerAppLaunchedListener(() => {
  Navigation.setDefaultOptions({
    topBar: {
      visible: false,
      drawBehind: true,
      animate: false
    }
  });
  Navigation.setRoot({
    root: {
      stack: {
        children: [
          {
            component: {
              name: "Camera"
            }
        },
          {
            component: {
            name: "Map"
          }
        }]
      }
    }
  });
});