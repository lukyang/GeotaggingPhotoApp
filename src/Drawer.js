import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from 'react-native';
import firebase from 'react-native-firebase';
import { goToAuth, goHome } from './Navigation';

export default class Drawer extends Component {
    static options() {
        return {
          statusBar: {
            backgroundColor: '#00766c',
          },
          topBar: {
            backButton: {
              visible: false
            },
            background: {
              color: '#009688',
            },
          },
          layout: {
            orientation: ['portrait']
          },
        }
      };

    signOutUser = () => {
        firebase.auth().signOut().then(
            goToAuth() 
        ).catch((error) => {
            return console.log(error)
        })
    };

    render () {
        return(
            <View style={styles.container}>
                <TouchableOpacity onPress={goHome} style={styles.button}>
                    <Text style={styles.buttonText}>Reload Map</Text>
                </TouchableOpacity> 
                <TouchableOpacity onPress={this.signOutUser} style={styles.button}>
                    <Text style={styles.buttonText}>Logout</Text>
                </TouchableOpacity> 
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container : {
      backgroundColor:'#009688',
      flex: 1,
      alignItems:'center',
      justifyContent :'center'
    },
    button: {
      width: 200,
      backgroundColor:'#1c313a',
       borderRadius: 25,
        marginVertical: 10,
        paddingVertical: 13
    },
    buttonText: {
      fontSize:16,
      fontWeight:'500',
      color:'#ffffff',
      textAlign:'center'
    }
  });