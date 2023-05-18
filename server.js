require('dotenv').config()
const express = require('express');
const firebase = require('firebase/app');
require('firebase/storage');
const fetch = require('node-fetch')
const app = express();
const port = process.env.PORT || 3000;

app.use(express.static('public'));

// TODO: Replace the following with your app's Firebase project configuration
// See: https://firebase.google.com/docs/web/learn-more#config-object
const firebaseConfig = {
  apiKey: "AIzaSyA1pkGnwcy4CdrQ9R3XKFYBOXY97aqXNwo",
  authDomain: "bot-strate.firebaseapp.com",
  projectId: "bot-strate",
  storageBucket: "bot-strate.appspot.com",
  messagingSenderId: "319550712927",
  appId: "1:319550712927:web:b71f8b1eb34c701a8e3fea"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Initialize Cloud Storage
const storage = firebase.storage();
const storageRef = storage.ref();

app.get('/latest', async (req, res) => {

// Retrieve the latest file's download URL
storageRef.child('/').listAll()
.then((result) => {
  const files = result.items;
  if (files.length === 0) {
    console.log('No files found in the storage bucket.');
    return;
  }

  // Sort files by timeCreated in descending order
  const sortedFiles = files.sort((a, b) => b.timeCreated - a.timeCreated);
  const latestFile = sortedFiles[0];

  // Get the download URL of the latest file
  return latestFile.getDownloadURL();
})
  .then((url) => {
    console.log('Latest file download URL:', url);
    const payload = {
      "documents": [
        url
      ]
    };
    gooeyAPI(payload)
    .then(data => {
      const userpayload = {
        "input_prompt":data,
        "tts_provider": "GOOGLE_TTS",
        "uberduck_voice_name": "kanye-west-rap",
        "uberduck_speaking_rate": 1.0,
        "google_voice_name": "en-IN-Standard-D",
        "google_speaking_rate": 1.0,
        "google_pitch": -1.25,
        "selected_model": "gpt_3_5_turbo",
        "avoid_repetition": true,
        "num_outputs": 2,
        "quality": 1.0,
        "max_tokens": 300,
      }
      gooeyVideobot(userpayload)
      .then(out =>{

        res.send(out)
      })
    })
  })
  .catch((error) => {
    console.error('Error retrieving latest file:', error);
  });

})
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });

async function gooeyAPI(p) {
  const response = await fetch("https://api.gooey.ai/v2/asr/", {
    method: "POST",
    headers: {
        "Authorization": "Bearer " + process.env.GOOEY_API_KEY,
        "Content-Type": "application/json",
    },
    body: JSON.stringify(p),
  });

  const result = await response.json();
  console.log(response.status, result.output.output_text);
  return result.output.output_text[0]
}



async function gooeyVideobot(quer) {
  const response = await fetch("https://api.gooey.ai/v2/video-bots/?run_id=lng1410n&uid=fm165fOmucZlpa5YHupPBdcvDR02", {
    method: "POST",
    headers: {
        "Authorization": "Bearer " + process.env.GOOEY_API_KEY,
        "Content-Type": "application/json",
    },
    body: JSON.stringify(quer),
  });

  const result = await response.json();
  console.log(response.status,  result.output.output_audio);
  return result.output.output_audio[0]
}

// gooeyVideobot();