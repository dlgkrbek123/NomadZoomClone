const socket = new WebSocket(`ws://${location.host}`);

socket.addEventListener('open', () => {
  console.log('연결');
});
socket.addEventListener('close', () => {
  console.log('연결끊김');
});

socket.addEventListener('message', (message) => {
  console.log(message.data);
});

setTimeout(() => {
  socket.send('hello from the browser!');
}, 5000);
