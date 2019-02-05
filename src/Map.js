import React, { Component } from 'react';
import { StyleSheet, View, TouchableOpacity, Image } from 'react-native';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import { PermissionsAndroid } from 'react-native';
import {Navigation} from 'react-native-navigation';
import Icon from 'react-native-vector-icons/Feather';
import firebase from 'react-native-firebase';

async function requestLocationPermission() {
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
        'title': 'Location Permission',
        'message': 'App needs access to your location'
      }
    )
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      console.log("Location permission granted")
    } else {
      console.log("Location permission denied")
    }
  } catch (err) {
    console.warn(err)
  }
};

requestLocationPermission();

export default class Map extends Component {
  static options(passProps) {
    return {
      statusBar: {
        backgroundColor: '#00766c',
      },
      topBar: {
        title: {
          text: 'Map',
          color: 'white',
          fontSize: 20,
        },
        backButton: {
          visible: false
        },
        background: {
          color: '#009688',
        },
      },
      sideMenu: {
        left: {
        },
      },
    }
  };

  state = {
    photoURLs: [],
  }

  getDownloadURL = async () => {
    firebase
    .firestore()
    .collection('Images')
    .get()
    .then(doc => {
      doc.docs.map((value) => {
        firebase.storage().ref(value._data.path).getDownloadURL().then((downloadURL) => {
          var donwloadURLs = [];
          donwloadURLs.push(downloadURL);
          this.state.photoURLs.push(donwloadURLs[0]);
          return console.log(this.state.photoURLs)
        })
        .catch((error) => {
          return console.log("Photo URL function error: " + error);
        })
      })
    })
  };
  
  componentDidMount () {
    this.getDownloadURL();
  };

  render() {
    return (
      <View style={styles.container}>
        <MapView
          provider={PROVIDER_GOOGLE}
          style={styles.map}
          initialRegion={{
          latitude: 10.315,
          longitude: 123.885,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
          }}
          showsTraffic={true}
          showsUserLocation={true}
          showsMyLocationButton={true}
        />
        <TouchableOpacity
          style={styles.button}
            onPress={() => {
              Navigation.push(this.props.componentId, {
                component: {
                  name: 'Camera',
                }
              });
            }}
        >
          <Icon name="camera" size={30} color="#fff" style={styles.cameraButton}/>
        </TouchableOpacity>
      </View>
    );
  };
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  button: {
    width: 60,  
    height: 60,   
    borderRadius: 30,            
    backgroundColor: '#009688',                                    
    position: 'absolute',                                          
    bottom: 25,                                                    
    right: 20, 
  },
  cameraButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingLeft: 15,
    paddingTop: 14,
  },
  annotationContainer: {
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    borderRadius: 15,
  },
  annotationFill: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'orange',
    transform: [{ scale: 0.6 }],
  }
})