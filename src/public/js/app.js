const socket = io();

const welocome = document.querySelector('#welcome');
const room = document.querySelector('#room');

const entranceForm = welcome.querySelector('form#entrance');
const msgForm = room.querySelector('form#msg');

room.hidden = true;

const addMessage = (message) => {
  const ul = room.querySelector('ul');
  const li = document.createElement('li');

  li.innerText = message;
  ul.appendChild(li);
};

entranceForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const roomNameInput = entranceForm.querySelector('input[name=roomname]');
  const nickNameInput = entranceForm.querySelector('input[name=nickname]');

  const roomName = roomNameInput.value;
  const nickname = nickNameInput.value;

  socket.emit('enter_room', roomName, nickname, () => {
    const h3 = document.createElement('h3');

    roomNameInput.value = '';
    nickNameInput.value = '';
    h3.innerText = `Room ${roomName}`;
    welcome.hidden = true;
    room.hidden = false;
    room.prepend(h3);

    // nickForm.addEventListener('submit', (e) => {
    //   e.preventDefault();
    //   const input = nickForm.querySelector('input');
    //   const value = input.value;

    //   socket.emit('nickname', value);
    // });

    msgForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = msgForm.querySelector('input');
      const value = input.value;

      input.value = '';
      socket.emit('new_message', value, roomName, () =>
        addMessage(`You: ${value}`)
      );
    });
  });
});

socket.onAny((event, ...args) => {
  console.log(event, args);
});

socket.on('welcome', (nickname) => {
  addMessage(`${nickname}님이 참가했어요.`);
});

socket.on('bye', (nickname) => {
  addMessage(`${nickname}님이 떠났습니다.`);
});

socket.on('new_message', (msg) => {
  addMessage(`${msg}`);
});
