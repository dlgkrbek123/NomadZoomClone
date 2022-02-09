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
- http 서버 생성 후
- 그 위에 웹소켓 서버를 생성
*/

wss.on('connection', (socket) => {
  // socket은 연결 라인
  socket.on('close', () => {
    console.log('연결끊김');
  });
  socket.on('message', (message) => {
    console.log(message.toString('utf8'));
  });

  socket.send('hello');
});

server.listen(3000, () => {
  console.log('Listening on 3000');
});
