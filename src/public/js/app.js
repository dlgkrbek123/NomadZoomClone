const socket = new WebSocket(`ws://${location.host}`);

const messageList = document.querySelector('ul');
const nicknameForm = document.querySelector('#nickname');
const messageForm = document.querySelector('#message');

socket.addEventListener('open', () => {
  // console.log('연결');
});
socket.addEventListener('close', () => {
  // console.log('연결끊김');
});

const makeMessage = (type, payload) => {
  const msg = { type, payload };
  return JSON.stringify(msg);
};

socket.addEventListener('message', (message) => {
  const li = document.createElement('li');
  li.innerText = message.data;

  messageList.append(li);
});

nicknameForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const input = e.target.querySelector('input');
  socket.send(makeMessage('nickname', input.value));
});

messageForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const input = e.target.querySelector('input');
  const value = input.value;

  input.value = '';
  socket.send(makeMessage('new_message', value));
});
