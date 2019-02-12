import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import {Navigation} from 'react-native-navigation';
import Logo from './Logo';
import firebase from 'react-native-firebase';
import { goHome } from './Navigation';

export default class Login extends Component {
  static options() {
    return {
      statusBar: {
        backgroundColor: '#00766c',
      },
      topBar: {
        visible: false,
        drawBehind: true,
        animate: false
      }
    };
  };

  state = { email: '', password: '', errorMessage: null };

  handleLogin = () => {
    const { email, password } = this.state
    firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then(() => goHome())
      .catch(error => this.setState({ errorMessage: error.message }))
  }

	render() {
		return(
      <View style={styles.container}>
        <Logo />
        {this.state.errorMessage &&
          <Text style={{ color: 'red' }}>
            {this.state.errorMessage}
          </Text>}
        <View style={styles.container2}>
            <TextInput style={styles.inputBox} 
            autoCapitalize="none"
            onChangeText={email => this.setState({ email })}
            value={this.state.email}
            underlineColorAndroid='rgba(0,0,0,0)' 
            placeholder="Email"
            placeholderTextColor = "#ffffff"
            selectionColor="#fff"
            keyboardType="email-address"
            />
            <TextInput style={styles.inputBox} 
            autoCapitalize="none"
            onChangeText={password => this.setState({ password })}
            value={this.state.password}
            underlineColorAndroid='rgba(0,0,0,0)' 
            placeholder="Password"
            secureTextEntry={true}
            placeholderTextColor = "#ffffff"
            />  
            <TouchableOpacity onPress={this.handleLogin} style={styles.button}>
              <Text style={styles.buttonText}>Login</Text>
            </TouchableOpacity>     
        </View>
        <View style={styles.signupTextCont}>
            <Text style={styles.signupText}>Don't have an account yet?</Text>
            <TouchableOpacity onPress={
              () => {Navigation.push(this.props.componentId, {
                  component: {
                    name: 'Signup',
                  }
                })
              }
            }>
            <Text style={styles.signupButton}> Sign Up</Text></TouchableOpacity>
        </View>
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
  signupTextCont : {
  	flexGrow: 1,
    alignItems:'flex-end',
    justifyContent :'center',
    paddingVertical:16,
    flexDirection:'row'
  },
  signupText: {
  	color:'rgba(255,255,255,0.6)',
  	fontSize:16
  },
  signupButton: {
  	color:'#ffffff',
  	fontSize:16,
  	fontWeight:'500'
  },
  container2 : {
    flexGrow: 1,
    justifyContent:'center',
    alignItems: 'center'
  },

  inputBox: {
    width:300,
    backgroundColor:'rgba(255, 255,255,0.2)',
    borderRadius: 25,
    paddingHorizontal:16,
    fontSize:16,
    color:'#ffffff',
    marginVertical: 10
  },
  button: {
    width:300,
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
