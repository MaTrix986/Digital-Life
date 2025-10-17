import { io } from "socket.io-client";
import fs from "fs"

const args = process.argv.slice(2);
let msg = '';

if (args.length === 0) {
    console.log('使用方法: node client.js <msg>');
    process.exit(1);
}


try {
    msg = {'msg': args[0]};
} catch (error) {
    console.error('JSON解析失败:', error.message);
    process.exit(1);
}


// 连接到Socket.IO服务器
const socket = io('http://localhost:3000');

socket.on('connect', () => {
    console.log('已连接到服务器');
    
    // 发送JSON数据
    socket.emit('chat message', msg);
    console.log('已发送JSON数据:', JSON.stringify(msg, null, 2));
    
    // 延迟退出，确保数据发送完成
    setTimeout(() => {
        process.exit(0);
    }, 1000);
});

socket.on('connect_error', (error) => {
    console.error('连接失败:', error.message);
    process.exit(1);
});