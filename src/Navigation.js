import { Navigation } from 'react-native-navigation'

export const goToAuth = () => Navigation.setRoot({
  root: {
    stack: {
      id: 'SignInStack',
      children: [
        {
          component: {
            name: 'Signup',
          },
        },
        {
          component: {
            name: 'Login',
          },
        },
      ],
    }
  }
});

export const goHome = () =>  Navigation.setRoot({
    root: {
      stack: {
        id: "HomeStack",
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