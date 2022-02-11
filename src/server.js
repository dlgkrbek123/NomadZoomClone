import http from 'http';
import express from 'express';
import SocketIO from 'socket.io';

const app = express();

// 정적 파일 서빙
app.use('/public', express.static(__dirname + '/public'));

// 뷰 템플릿 엔진 설정
app.set('view engine', 'pug');
app.set('views', __dirname + '/views');

// 라우트
app.get('/', (req, res) => res.render('home'));
app.get('/*', (req, res) => res.redirect('/'));

// 서버 인스턴스 생성
const httpServer = http.createServer(app);
const wsServer = SocketIO(httpServer);

// 소켓 서버 튜닝
wsServer.on('connection', (socket) => {
  socket.on('disconnecting', () => {
    socket.rooms.forEach((room) => {
      socket.to(room).emit('bye', socket.nickname);
    });
  });

  socket.on('enter_room', (roomName, nickname, done) => {
    socket.nickname = nickname;
    socket.join(roomName);
    socket.to(roomName).emit('welcome', nickname);
    done();
  });

  socket.on('new_message', (value, roomName, done) => {
    socket.to(roomName).emit('new_message', `${socket.nickname}: ${value}`);
    done();
  });

  socket.on('nickname', (nickname) => (socket.nickname = nickname));
});

httpServer.listen(3000, () => {
  console.log('Listening on 3000');
});
