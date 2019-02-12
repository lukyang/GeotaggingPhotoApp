import React, { Component } from 'react';
import { StyleSheet, View, TouchableOpacity, Image } from 'react-native';
import { PermissionsAndroid } from 'react-native';
import {Navigation} from 'react-native-navigation';
import Icon from 'react-native-vector-icons/Feather';
import firebase from 'react-native-firebase';
import Mapbox from '@mapbox/react-native-mapbox-gl';

Mapbox.setAccessToken('pk.eyJ1IjoibHVreWFuZyIsImEiOiJjamwzazB5czEwMDM4M3BscnMzYXR5MXloIn0.AFqzEihgBGah3yk9ziLTvg');

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
  static options() {
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
    }
  };

  state = {
    currentUser: null,
    markers: [],
    updateStatus: false,
  };

  getDownloadURL = async () => {
    firebase
    .firestore()
    .collection('Images')
    .get()
    .then(doc => {
      doc.docs.map((value) => {
        firebase
        .storage()
        .ref(value._data.path)
        .getDownloadURL()
        .then((downloadURL) => {
          var donwloadURLs = [];
          donwloadURLs.push(downloadURL);
          this.state.markers.push({
            id: value._data.id,
            imagePath: donwloadURLs[0],
            coordinate: {
              latitude : value._data.latitude,
              longitude: value._data.longitude
            }
          });
          return console.log(this.state.markers)
        })
        .catch((error) => {
          return console.log("Photo URL function error: " + error);
        });
      })
    })
  };

  
  componentWillMount () {
    clearInterval(this.getLocationInterval);
    this.getDownloadURL();
    this.intervalID = setInterval(() => {
      if (this.state.updateStatus === true) {
        this.setState({updateStatus: false});
      } else {
        this.setState({updateStatus: true});
      }
    }, 3000);
    // this.timeoutID = setTimeout(() => {
    //   clearInterval(this.intervalID);
    // }, 10000)
  };

  componentDidMount () {
    const { currentUser } = firebase.auth()
    this.setState({ currentUser })
  }

  componentWillUnmount () {
    // clearTimeout(this.timeoutID);
    clearInterval(this.intervalID);
    this.setState({
      updateStatus: false,
      markers: []
    })
  }

  render() {
    return (
      <View style={styles.container}>
        <Mapbox.MapView
            zoomLevel={11}
            centerCoordinate={[123.915, 10.315]}
            style={styles.container}
            showUserLocation={true}>
            {this.state.markers.map((markers, index) => {
              return (
                <Mapbox.PointAnnotation
                  key={index}
                  id={markers.id}
                  coordinate={[markers.coordinate.longitude, markers.coordinate.latitude]}>
                  <Image source={{uri: markers.imagePath}}  style={{width: 63, height: 112}}/>
                </Mapbox.PointAnnotation>
              )
            })}
        </Mapbox.MapView>
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
})