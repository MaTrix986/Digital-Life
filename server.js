import { createServer } from 'http'
import { parse } from 'url'
import next from 'next'
import { Server } from 'socket.io'
 
const port = parseInt(process.env.PORT || '3000', 10)
const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()
 
app.prepare().then(() => {

  const httpServer = createServer(handle);

  const io = new Server(httpServer);

  io.on("connection", (socket)=> {
    // use socket to handle each socket connection.
    console.log('用户已连接:', socket.id);
    
    // 接收JSON数据并广播给所有客户端
    socket.on('json-data', (data) => {
      console.log('收到JSON数据:', data);
      // 广播给所有连接的客户端
      io.emit('json-data', data);
    });

    socket.on('chat message', (msg) => {
      console.log("eimt:", msg);
      io.emit('chat message', msg);
    })
    
    socket.on('disconnect', () => {
      console.log('用户已断开连接:', socket.id);
    });
  });

  httpServer
    .once("error", (err) => {
      console.error(err);
      process.exit(1);
    })
    .listen(port, () => {
      console.log(`> Ready on http://localhost:${port} as ${dev ? 'development' : process.env.NODE_ENV}`)
    })


  // createServer((req, res) => {
  //   const parsedUrl = parse(req.url, true)
  //   handle(req, res, parsedUrl)
  // }).listen(port)
 
  // console.log(
  //   `> Server listening at http://localhost:${port} as ${
  //     dev ? 'development' : process.env.NODE_ENV
  //   }`
  // )
})