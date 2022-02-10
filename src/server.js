import http from 'http';
import express from 'express';
import WebSocket from 'ws';

const app = express();

// 정적 파일 서빙
app.use('/public', express.static(__dirname + '/public'));

// 뷰 템플릿 엔진 설정
app.set('view engine', 'pug');
app.set('views', __dirname + '/views');

// 라우트
app.get('/', (req, res) => res.render('home'));
app.get('/*', (req, res) => res.redirect('/'));

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });
/* 
  http, 웹소켓 서버 통합
  - http 서버 생성 후 => 그 위에 웹소켓 서버를 생성
*/

const sockets = [];

wss.on('connection', (socket) => {
  socket.nickname = '익명';
  sockets.push(socket);

  socket.on('close', () => {
    const index = sockets.findIndex((item) => item === socket);

    if (index !== -1) {
      sockets.splice(index, 1);
    }
  });

  socket.on('message', (message) => {
    const { type, payload } = JSON.parse(message.toString('utf8'));

    switch (type) {
      case 'nickname':
        socket.nickname = payload;
        break;
      case 'new_message':
        sockets.forEach((socketItem) =>
          socketItem.send(`${socket.nickname}: ${payload}`)
        );
        break;
    }
  });
});

server.listen(3000, () => {
  console.log('Listening on 3000');
});
