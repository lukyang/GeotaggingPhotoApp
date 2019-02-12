import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import firebase from 'react-native-firebase';
import { goToAuth, goHome } from './Navigation'

export default class Loading extends React.Component {
  componentDidMount() {
    firebase.auth().onAuthStateChanged(user => {
      user ? goHome() : goToAuth()
  })
}

  render() {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#ffffff" />
      </View>
    )
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor:'#1abc9c',
  }
})