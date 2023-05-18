// Initialize Firebase
const firebaseConfig = {
  // Add your Firebase configuration here
  apiKey: "AIzaSyA1pkGnwcy4CdrQ9R3XKFYBOXY97aqXNwo",
  authDomain: "bot-strate.firebaseapp.com",
  projectId: "bot-strate",
  storageBucket: "bot-strate.appspot.com",
  messagingSenderId: "319550712927",
  appId: "1:319550712927:web:b71f8b1eb34c701a8e3fea"
};
firebase.initializeApp(firebaseConfig);

// Global variables
let mediaRecorder;
let recordedChunks = [];

// Get DOM elements
const recordBtn = document.getElementById('record-btn');
const audioPreview = document.getElementById('audio-preview');
const loading = document.getElementById('loading');

// Handle click event on the record button
recordBtn.addEventListener('click', () => {
  if (recordBtn.textContent === 'Record') {
    startRecording();
    recordBtn.textContent = 'Stop';
  } else {
    stopRecording();
    recordBtn.textContent = 'Record';
  }
});

// Start audio recording
function startRecording() {
  audioPreview.style.display = "none"
  loading.innerHTML = "recording..."
  navigator.mediaDevices.getUserMedia({ audio: true })
    .then(stream => {
      mediaRecorder = new MediaRecorder(stream);

      mediaRecorder.addEventListener('dataavailable', event => {
        recordedChunks.push(event.data);
      });

      mediaRecorder.addEventListener('stop', () => {
        const audioBlob = new Blob(recordedChunks, { type: 'audio/mp3' });
        const audioUrl = URL.createObjectURL(audioBlob);
        // audioPreview.src = audioUrl;

        uploadAudioToFirebase(audioBlob);
      });

      mediaRecorder.start();
    })
    .catch(error => {
      console.error('Error accessing microphone:', error);
    });
}

// Stop audio recording
function stopRecording() {
  if (mediaRecorder && mediaRecorder.state === 'recording') {
    mediaRecorder.stop();
    recordedChunks = [];
  }
  sendReq()
  loading.innerHTML = "loading answer..."

}

// Upload audio to Firebase Storage
function uploadAudioToFirebase(audioBlob) {
  const storageRef = firebase.storage().ref();
  const filename = generateFilename();
  const audioFileRef = storageRef.child(filename);

  audioFileRef.put(audioBlob)
    .then(snapshot => {
      console.log('Upload successful:', snapshot);
    })
    .catch(error => {
      console.error('Error during upload:', error);
    });
}

// Generate a unique filename for the uploaded audio
function generateFilename() {
  const timestamp = Date.now();
  return `audio_${timestamp}.mp3`;
}

function sendReq() {

fetch('/latest').then(response => {
    console.log(response)
    return response.text();
}) .then(data => {
  console.log(data)
  audioPreview.style.display = "inline"
  audioPreview.src = data;
  loading.innerHTML = "listen to RANA's response"


})
.catch(error => {
      console.error('Error retrieving: ', error);
    });
}

// Event listener for the button click



