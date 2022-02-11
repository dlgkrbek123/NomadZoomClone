const socket = io();

const welocome = document.querySelector('#welcome');
const room = document.querySelector('#room');
const form = welcome.querySelector('form');

room.hidden = true;

const addMessage = (message) => {
  const ul = room.querySelector('ul');
  const li = document.createElement('li');

  li.innerText = message;
  ul.appendChild(li);
};

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const input = form.querySelector('input');
  const roomName = input.value;

  socket.emit('enter_room', { payload: roomName }, () => {
    const h3 = document.createElement('h3');
    const form = room.querySelector('form');

    welcome.hidden = true;
    room.hidden = false;

    h3.innerText = `Room ${roomName}`;
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = form.querySelector('input');
      const value = input.value;

      input.value = '';
      socket.emit('new_message', value, roomName, () =>
        addMessage(`You: ${value}`)
      );
    });

    room.prepend(h3);
  });
  input.value = '';
});

socket.onAny((event, ...args) => {
  console.log(event, args);
});

socket.on('welcome', () => {
  addMessage(`누군가 참가했어요.`);
});

socket.on('bye', () => {
  addMessage('누군가 나갔다.');
});

socket.on('new_message', (msg) => {
  addMessage(`${msg}`);
});
