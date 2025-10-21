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
    // use socket to handle each single socket connection.
    console.log('用户已连接:', socket.id);

    socket.on('chat message', (msg) => {
      console.log("emit:", msg);
      io.emit('chat message', msg);
    })

    socket.on('system info', systemInfo => {
      console.log("Recieve system info");
      io.emit('info', systemInfo);
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
})