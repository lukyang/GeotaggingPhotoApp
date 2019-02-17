import React, { Component } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Dimensions, ImageBackground } from 'react-native';
import { RNCamera } from 'react-native-camera';
import Icon from 'react-native-vector-icons/AntDesign';
import firebase from 'react-native-firebase';
import {Navigation} from 'react-native-navigation';
import RNFS from 'react-native-fs';

const flashModeOrder = {
  off: 'on',
  on: 'auto',
  auto: 'torch',
  torch: 'off',
};

export default class Camera extends Component {
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

  state = {
    currentUser: null,
    path: null,
    uploadPath: null,
    flash: 'off',
    zoom: 0,
    autoFocus: 'on',
    depth: 0,
    type: 'back',
    whiteBalance: 'auto',
    ratio: '16:9',
    ratios: [],
    photoId: 1,
    showGallery: false,
    photos: [],
    faces: [],
    recordOptions: {
      mute: false,
      maxDuration: 5,
      quality: RNCamera.Constants.VideoQuality["480p"],
    },
    isRecording: false,
    geolocation: null,
  };

  getRatios = async function() {
    const ratios = await this.camera.getSupportedRatios();
    return ratios;
  };

  toggleFacing() {
    this.setState({
      type: this.state.type === 'back' ? 'front' : 'back',
    });
  }

  toggleFlash() {
    this.setState({
      flash: flashModeOrder[this.state.flash],
    });
  }
  
  returnToMap = () => {
    Navigation.push(this.props.componentId, {
      component: {
        name: 'Map',
      }
    })
  };

  findCoordinates = async () => {
    navigator.geolocation.getCurrentPosition(
      position => {
        this.setState({ geolocation: position });
        console.log(this.state.geolocation)
      },
      error => {
        console.log(error);
      },
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 10000, }
    );
  };

  takePicture = async () => {
    try {
      const options = { quality: 0.3, base64: true, fixOrientation: true};
      const data = await this.camera.takePictureAsync(options);
      this.setState({ path: data.uri });
      this.setState({ uploadPath: data.uri });
      this.findCoordinates();
      console.log('Path to image: ' + this.state.path);
    } catch (error) {
      console.log('Take Picture error: ' + error);
    }
  };

  takePictureButton = async () => {
    {this.state.path ? () => {
      RNFS.unlink(this.state.path).then(this.takePicture())
    } : this.takePicture()}
  }

  uploadPicture = async (timestamp) => {
    firebase
    .storage()
    .ref("UserPhotos/" + "IMG" + timestamp + ".jpg")
    .putFile(this.state.uploadPath)
    .then(success => {
      RNFS.unlink(this.state.uploadPath);
      return console.log("Photo uploaded successfully");
    })
    .catch(error => {
      console.log("Storage upload failed: " + error);
    });
  };

  databaseUpload = async (timestamp) => {
    firebase.firestore().collection("Images").doc("IMG" + timestamp).set({
      id:  "IMG" + timestamp,
      path: "UserPhotos/" + "IMG" + timestamp + ".jpg",
      latitude: this.state.geolocation.coords.latitude,
      longitude: this.state.geolocation.coords.longitude,
      timeUploaded: timestamp,
    })
    .then(success => {
      return console.log("Firebase database uploaded successfully");
    })
    .catch(error => {
      return console.log("Database upload failed: " + error);
    });
  }

  checkButtonFuntion = async () => {
    if (this.state.geolocation != null) {
      clearInterval(this.intervalID);
      const timestamp = new Date().getTime();
      this.returnToMap();
      this.setState({ path: null });
      this.uploadPicture(timestamp)
      .then((success) => {
        this.databaseUpload(timestamp);
        return console.log("Check Button Function Successful")
      })
      .catch((error) => {
        return console.log("Check Button Function Error: " + error)
      });
    } else {
      this.findCoordinates();
    }
  };

  componentWillMount () {
    this.getLocationInterval = setInterval(() => {
      this.findCoordinates()
    }, 1000);
    this.getLocationTimeoutID = setTimeout(() => {
      clearInterval(this.getLocationInterval);
    }, 10000)
  }

  componentDidMount () {};

  componentWillUnmount () {
    clearInterval(this.getLocationInterval);
    clearTimeout(this.getLocationTimeoutID);
  }

  renderCamera() {
    return (
      <RNCamera
        ref={ref => {
          this.camera = ref;
        }}
        style={{
          flex: 1,
        }}
        type={this.state.type}
        flashMode={this.state.flash}
        autoFocus={this.state.autoFocus}
        zoom={this.state.zoom}
        whiteBalance={this.state.whiteBalance}
        ratio={this.state.ratio}
        focusDepth={this.state.depth}
        permissionDialogTitle={'Permission to use camera'}
        permissionDialogMessage={'We need your permission to use your camera phone'}
      >
        <View
          style={{
            flex: 0.5,
            flexDirection: 'row',
            justifyContent: 'space-around',
          }}
        >
          <TouchableOpacity style={styles.flipButton} onPress={this.toggleFacing.bind(this)}>
            <Text style={styles.flipText}> FLIP </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.flipButton} onPress={this.toggleFlash.bind(this)}>
            <Text style={styles.flipText}> FLASH: {this.state.flash} </Text>
          </TouchableOpacity>
        </View>
        <View
          style={styles.picButtonContainer}
        >
          <TouchableOpacity
            style={ styles.picButton }
            onPress={this.takePictureButton.bind(this)}
          >
          </TouchableOpacity>
        </View>
      </RNCamera>
    );
  };

  renderImage() {
    return (
      <View>
        <ImageBackground
          source={{ uri: this.state.path }}
          style={styles.preview}
        />
        <View
          style={styles.buttonContainer}
        >
          <TouchableOpacity
          style={ styles.XButton }
          onPress={
            () => {
              RNFS.unlink(this.state.path);
              this.setState({ path: null })
          }}
          >
            <Icon name="close" size={30} color="#fff" style={styles.checkandXicon}/>
          </TouchableOpacity>
          <TouchableOpacity
          style={ styles.checkButton }
          onPress={this.checkButtonFuntion.bind(this)}
          >
            <Icon name="check" size={30} color="#fff" style={styles.checkandXicon}/>
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  render() {
    return <View style={styles.container}>{this.state.path ? this.renderImage() : this.renderCamera()}</View>;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 10,
    backgroundColor: '#000',
  },
  navigation: {
    flex: 1,
  },
  flipButton: {
    flex: 0.3,
    height: 40,
    marginHorizontal: 2,
    marginBottom: 10,
    marginTop: 20,
    borderRadius: 20,
    padding: 5,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#009688',
    borderColor: 'white',
    borderWidth: 3,
  },
  flipText: {
    color: 'white',
    fontSize: 15,
  },
  item: {
    margin: 4,
    backgroundColor: 'indianred',
    height: 35,
    width: 80,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  picButtonContainer: {
    position: 'absolute',                                          
    bottom: 25,
    alignSelf: 'center',
  },
  picButton: {
    width: 60,  
    height: 60,   
    borderRadius: 30,            
    backgroundColor: '#009688',
    borderColor: 'white',
    borderWidth: 5,
  },
  checkButton: {
    width: 60,  
    height: 60,   
    borderRadius: 30,            
    backgroundColor: '#009688',                                        
  },
  XButton: {
    width: 60,  
    height: 60,   
    borderRadius: 30,            
    backgroundColor: '#009688',
  },
  row: {
    flexDirection: 'row',
  },
  preview: {
    flex: 1,
    height: Dimensions.get('window').height,
    width: Dimensions.get('window').width,
  },
  buttonContainer: {                                         
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    bottom: -500,
  },
  checkandXicon: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingLeft: 15,
    paddingTop: 15,
  }
});