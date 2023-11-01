import http from 'http';
import express from 'express';
import { Server } from 'socket.io';
import { instrument } from '@socket.io/admin-ui';

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
const wsServer = new Server(httpServer, {
  cors: {
    origin: ['https://admin.socket.io'],
    credentials: true,
  },
});
instrument(wsServer, {
  auth: false,
});
// http://localhost:3000/admin으로 접근

// socket helper
const publicRooms = () => {
  const { sids, rooms } = wsServer.sockets.adapter;
  const publicRooms = [];

  rooms.forEach((_, key) => {
    if (!sids.get(key)) publicRooms.push(key);
  });

  return publicRooms;
};

const countRoom = (roomName) => {
  return wsServer.sockets.adapter.rooms.get(roomName)?.size ?? 0;
};

// 소켓 서버 튜닝
wsServer.on('connection', (socket) => {
  socket.on('disconnecting', () => {
    socket.rooms.forEach((room) => {
      let count = countRoom(room) - 1;
      if (count < 0) count = 0;

      socket.to(room).emit('bye', room, socket.nickname, countRoom(room) - 1);
    });
  });
  socket.on('disconnect', () => {
    wsServer.sockets.emit('room_change', publicRooms());
  });

  socket.on('join_room', (roomName, done) => {
    debugger;
    console.log(roomName);
    socket.join(roomName);
    done();
  });
});

httpServer.listen(3000, () => console.log('Listening on 3000'));
