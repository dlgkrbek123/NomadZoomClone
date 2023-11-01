const socket = io();
const myFace = document.querySelector('video#myFace');
const muteBtn = document.querySelector('#mute');
const cameraBtn = document.querySelector('#camera');
const cameraSelect = document.querySelector('#cameras');

const welcome = document.getElementById('welcome');
const welcomeForm = welcome.querySelector('form');
const call = document.getElementById('call');

call.hidden = true;

let myStream;
let muted = false;
let cameraOff = false;

const getCameras = async () => {
  try {
    const devices = await navigator.mediaDevices.enumerateDevices();
    const videoInputs = devices.filter(
      (device) => device.kind === 'videoinput'
    );
    const currentCamera = myStream.getVideoTracks()[0].label;

    videoInputs.forEach((videoInput) => {
      const option = document.createElement('option');
      option.value = videoInput.deviceId;
      option.innerText = videoInput.label;
      if (currentCamera.label === videoInput.label) option.selected = true;

      cameraSelect.appendChild(option);
    });
  } catch (e) {
    console.log(e);
  }
};

const getMedia = async (deviceId) => {
  try {
    myStream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: deviceId ? { deviceId } : { facingMode: 'user' },
    });
    if (!deviceId) await getCameras();

    myFace.srcObject = myStream;
  } catch (e) {
    alert(e);
    console.log(e);
  }
};

const startMedia = () => {
  alert('sex');
  welcome.hidden = true;
  call.hidden = false;
  getMedia();
};

muteBtn.addEventListener('click', () => {
  const audioTracks = myStream.getAudioTracks();

  if (!muted) {
    muteBtn.innerText = 'Unmute';
    muted = true;

    audioTracks.forEach((track) => {
      track.enabled = false;
    });
  } else {
    muteBtn.innerText = 'Mute';
    muted = false;

    audioTracks.forEach((track) => {
      track.enabled = true;
    });
  }
});

cameraBtn.addEventListener('click', () => {
  const videoTracks = myStream.getVideoTracks();

  if (!cameraOff) {
    cameraBtn.innerText = 'Turn Camera On';
    cameraOff = true;

    videoTracks.forEach((track) => {
      track.enabled = false;
    });
  } else {
    cameraBtn.innerText = 'Turn Camera Off';
    cameraOff = false;

    videoTracks.forEach((track) => {
      track.enabled = true;
    });
  }
});

cameraSelect.addEventListener('change', (e) => {
  getMedia(cameraSelect.value);
});

welcomeForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const input = welcomeForm.querySelector('input');

  alert(typeof startMedia);

  socket.emit('join_room', input.value, startMedia);

  input.value = '';
});
