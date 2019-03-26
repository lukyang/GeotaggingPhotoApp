var admin = require("firebase-admin");

var serviceAccount = require("./geotaggingphotoapp-8286453226fb.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://geotaggingphotoapp.firebaseio.com",
  storageBucket: "geotaggingphotoapp.appspot.com"
});
const functions = require('firebase-functions');

'use strict';

// Cut off time. Child nodes older than this will be deleted.


admin.firestore().settings( { timestampsInSnapshots: true })
/**
 * This database triggered function will check for child nodes that are older than the
 * cut-off time. Each child needs to have a `timestamp` attribute.
 */

const CUT_OFF_TIME = 2 * 60 * 60 * 1000; // 2 Hours in milliseconds.

databaseDelete = (document) => {
  admin.firestore().collection("Images").doc(document).delete().then(() => {
    return console.log("Firestore delete succesful")
  }).catch((error) => {
    console.log("Firestore delete error: " + error)
  });
}

storageDelete = (filePath) => {
  admin.storage().bucket().file(filePath).delete().then(() => {
    return console.log("Storage delete successful")
  }).catch((error) => {
    console.log("Storage delete error: " + error)
  });
}

exports.deleteOldItems = functions.firestore.document("Images/{documentID}").onCreate((snap, context) => {
  const time = Date.now();
  admin
  .firestore()
  .collection("Images")
  .get()
  .then((querySnapshot) => {
    querySnapshot.docs.forEach((value) => {
      if ((time - value._fieldsProto.timeUploaded.doubleValue) > CUT_OFF_TIME) {
        databaseDelete(value._fieldsProto.id.stringValue);
        storageDelete(value._fieldsProto.path.stringValue);
      } else {
        return console.log("Photo is still new")
      }
    });
    return console.log("Function successful")
  })
  .catch((error) => {
    console.log('Error: ' + error)
  })
});