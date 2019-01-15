import React, { Component } from 'react';
import { StyleSheet, View, TouchableOpacity, Image } from 'react-native';
import Mapbox from '@mapbox/react-native-mapbox-gl';
import { PermissionsAndroid } from 'react-native';
import {Navigation} from 'react-native-navigation';
import Icon from 'react-native-vector-icons/Feather';

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
  renderAnnotations() {
    return (
      <Mapbox.PointAnnotation
        key='pointAnnotation'
        id='pointAnnotation'
        coordinate={[123.885, 10.315]}>
        <Image source={{uri: "https://images.unsplash.com/photo-1535498730771-e735b998cd64?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&w=1000&q=80"}} style={{width: 36, height: 64}}/>
      </Mapbox.PointAnnotation>
    )
  };
  
  render() {
    return (
      <View style={styles.container}>
        <Mapbox.MapView
            styleURL={Mapbox.StyleURL.Street}
            zoomLevel={10}
            centerCoordinate={[123.885, 10.315]}
            showUserLocation={true}
            style={styles.container}>
            {this.renderAnnotations()}
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
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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