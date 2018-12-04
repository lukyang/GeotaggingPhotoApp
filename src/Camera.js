import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Dimensions, ImageBackground } from 'react-native';
import { RNCamera } from 'react-native-camera';
import Icon from 'react-native-vector-icons/AntDesign';

const flashModeOrder = {
  off: 'on',
  on: 'auto',
  auto: 'torch',
  torch: 'off',
};

export default class Camera extends React.Component {
  state = {
    path: null,
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
      quality: RNCamera.Constants.VideoQuality["288p"],
    },
    isRecording: false
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

  setRatio(ratio) {
    this.setState({
      ratio,
    });
  }


  setFocusDepth(depth) {
    this.setState({
      depth,
    });
  }

  takePicture = async () => {
    try {
      const data = await this.camera.takePictureAsync();
      this.setState({ path: data.uri });
      // this.props.updateImage(data.uri);
      // console.log('Path to image: ' + data.uri);
    } catch (err) {
      console.log('err: ', err);
    }
  };

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
            onPress={this.takePicture.bind(this)}
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
          onPress={() => this.setState({ path: null })}
          >
            <Icon name="close" size={30} color="#009688" style={styles.checkandXicon}/>
          </TouchableOpacity>
          <TouchableOpacity
          style={ styles.checkButton }
          >
            <Icon name="check" size={30} color="#009688" style={styles.checkandXicon}/>
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
  gallery: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
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
    backgroundColor: '#ffffff',                                        
  },
  XButton: {
    width: 60,  
    height: 60,   
    borderRadius: 30,            
    backgroundColor: '#ffffff',
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
    top: 500
  },
  checkandXicon: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingLeft: 15,
    paddingTop: 15,
  }
});