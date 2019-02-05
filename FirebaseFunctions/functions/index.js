var admin = require("firebase-admin");

var serviceAccount = require("./geotaggingphotoapp-firebase-adminsdk-lwiwp-d9a8c1d8af.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://geotaggingphotoapp.firebaseio.com"
});
const functions = require('firebase-functions');
const path = require('path');

exports.makeDownloadURL = functions.storage.object().onFinalize((object) => {
      // File and directory paths.
  const filePath = object.name;
  // Cloud Storage files.
  // const bucket = admin.storage().bucket(object.bucket);
  const fileDir = path.dirname(filePath);
  const fileName = path.basename(filePath);
  const bucket = admin.storage().bucket(object.bucket);
  const file = bucket.file(fileName);
  const downloadURL = functions.storage().ref(filePath).getDownloadURL()
  // return file.getSignedUrl({
  //   action: 'read',
  //   expires: '03-09-2500'
  // }).then(signedUrl => {
  //   return console.log(signedUrl)
  // });
  return console.log(downloadURL)
})