var admin = require("firebase-admin");

var serviceAccount = require("./geotaggingphotoapp-firebase-adminsdk-lwiwp-d9a8c1d8af.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://geotaggingphotoapp.firebaseio.com"
});
const functions = require('firebase-functions');

'use strict';

// Cut off time. Child nodes older than this will be deleted.
const CUT_OFF_TIME = 1 * 60 * 60 * 1000; // 2 Hours in milliseconds.

/**
 * This database triggered function will check for child nodes that are older than the
 * cut-off time. Each child needs to have a `timestamp` attribute.
 */
exports.deleteOldItems = functions.firestore.document("Images/{documentID}").onCreate((snap, context) => {
  const time = new Date().getTime;
  admin
  .firestore()
  .collection("Images")
  .get()
  .then((doc) => {
    doc.docs.map((value) => {
      if ((time - value._data.timeUploaded) >= CUT_OFF_TIME) {
        // eslint-disable-next-line promise/no-nesting
        admin.firestore().collection("Images").doc(value._data.id).delete().then(() => {
          return console.log("Firestore delete succesful")
        }).catch(
          console.log("Firestore delete error")
        );
        // eslint-disable-next-line promise/no-nesting
        admin.storage().bucket().file("UserPhotos/" + value._data.id + ".jpg").delete().then(() => {
          return console.log("Storage delete successful")
        }).catch(
          console.log("Storage delete error")
        )
      } else {
        return console.log("Photo is still new")
      }
    });
    return console.log("Function successful")
  })
  .catch(
    console.log('Error')
  )
});