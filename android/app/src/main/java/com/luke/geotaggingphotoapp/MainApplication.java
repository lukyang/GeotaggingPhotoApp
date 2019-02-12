package com.luke.geotaggingphotoapp;

import android.app.Application;

import com.facebook.react.ReactApplication;
import com.rnfs.RNFSPackage;
import io.invertase.firebase.RNFirebasePackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;
import com.mapbox.rctmgl.RCTMGLPackage;

import com.reactnativenavigation.NavigationApplication;
import com.reactnativenavigation.react.NavigationReactNativeHost;
import com.reactnativenavigation.react.ReactGateway;

import org.reactnative.camera.RNCameraPackage;
import com.oblador.vectoricons.VectorIconsPackage;

import io.invertase.firebase.RNFirebasePackage;
import io.invertase.firebase.auth.RNFirebaseAuthPackage;
import io.invertase.firebase.storage.RNFirebaseStoragePackage;
import io.invertase.firebase.fabric.crashlytics.RNFirebaseCrashlyticsPackage;
import io.invertase.firebase.functions.RNFirebaseFunctionsPackage;
import io.invertase.firebase.database.RNFirebaseDatabasePackage;
import io.invertase.firebase.firestore.RNFirebaseFirestorePackage; 

import java.util.Arrays;
import java.util.List;

public class MainApplication extends NavigationApplication {
      
      @Override
      protected ReactGateway createReactGateway() {
          ReactNativeHost host = new NavigationReactNativeHost(this, isDebug(), createAdditionalReactPackages()) {
              @Override
              protected String getJSMainModuleName() {
                  return "index";
              }
          };
          return new ReactGateway(this, isDebug(), host);
      }
  
      @Override
      public boolean isDebug() {
          return BuildConfig.DEBUG;
      }
  
      protected List<ReactPackage> getPackages() {
          // Add additional packages you require here
          // No need to add RnnPackage and MainReactPackage
          return Arrays.<ReactPackage>asList(
            new MainReactPackage(),
            new RNFSPackage(),
            new VectorIconsPackage(),
            new RNFirebasePackage(),
            new RNCameraPackage(),
            new RNFirebaseAuthPackage(),
            new RNFirebaseStoragePackage(),
            new RNFirebaseCrashlyticsPackage(),
            new RNFirebaseFunctionsPackage(),
            new RNFirebaseDatabasePackage(),
            new RNFirebaseFirestorePackage(),
            new RCTMGLPackage()
          );
      }
    
      @Override
      public List<ReactPackage> createAdditionalReactPackages() {
          return getPackages();
      }
  }