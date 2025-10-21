import { io } from "socket.io-client";
import os  from 'os'
import { sys } from "typescript";
import { execSync } from 'child_process';



class Sender{
    constructor() {
        this.server = 'http://localhost:3000';
        this.socket = null;
        this.intervalId = null;
        this.isConnected = false;
        this.reconnectAttempts = 0;
        this.maxReconnectAttempts = 10;
        this.reconnectDelay = 5000; 
        this.intervalDelay = 1000;


        this.init();
    }

    init() {
        this.initSocket();
        this.setupErrorHandling();
    }

    initSocket() {
        console.log(`Connecting to ${this.server}... `);
        
        this.socket = io(this.server, {
            reconnection: true,
            reconnectionAttempts: this.reconnectAttempts,
            reconnectionDelay: this.reconnectDelay,
            timeout: 20000
        });

        this.socket.on('connect', ()=>{
            this.isConnected = true;
            this.reconnectAttempts = 0;
            console.log("Successfully connected to server");
            this.startSending();    
        });

        this.socket.on('disconnect', (reason) => {
            this.isConnected = false;
            console.log(`Connection lost: ${reason}`);
            this.stopSending();

            if (reason === 'io server disconnect') {
                setTimeout(() => {
                    this.socket.connect();
                }, this.reconnectDelay);
            }
        });

        this.socket.on('connect_error', (error) => {
            this.isConnected = false;
            this.reconnectAttempts++;
            console.log(`Connection error (try ${this.reconnectAttempts}/${this.maxReconnectAttempts}):`, error.message);
            
            if (this.reconnectAttempts >= this.maxReconnectAttempts) {
                console.log('Reached max reconnection attempts. Please check server status...');
                process.exit(1);
            }
        });

        this.socket.on('reconnect', (attemptNumber) => {
            console.log(`Reconnection success ( ${attemptNumber}-th time)`);
            this.isConnected = true;
            this.startSending();
        });
    }

    setupErrorHandling() {
        process.on('SIGINT', () => {
            console.log('\nClosing the application...');
            this.cleanup();
            process.exit(0);
        });

        process.on('SIGTERM', () => {
            console.log('Termination signal received, closing the application...');
            this.cleanup();
            process.exit(0);
        });

        process.on('uncaughtException', (error) => {
            console.error('Uncatched Exception:', error);
            this.cleanup();
            process.exit(1);
        });

        process.on('unhandledRejection', (reason, promise) => {
            console.error('unhandled Promise rejection:', reason);
        });
    }

    getSystemInfo() {
        const getCpuLoad = () => {
            try {
                const output = execSync('wmic cpu get loadpercentage').toString();
                const load = output.split('\n')[1].trim();
                return load ? parseInt(load) : 0;
            } catch (error) {
                console.error('Error fetching CPU load:', error);
            return 0;
            }
        };

        return {
            timestamp: new Date().toISOString(),
            localTime: new Date().toLocaleDateString('zh-CN'),
            uptime: Math.floor(process.uptime()),
            systemUptime: Math.floor(os.uptime()),
            memory: {
                free: Math.round(os.freemem() / 1024 / 1024),
                total: Math.round(os.totalmem() / 1024 / 1024),
                usage: Math.round((1 - os.freemem() / os.totalmem()) * 100)
            },
            cpu: {
                load: getCpuLoad(),
                cores: os.cpus().length
            },
            platform: os.platform(),
            hostname: os.hostname(),
            msg: new Date().toISOString(),
        }
    }

    startSending() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
        }

        this.intervalId = setInterval(() => {
            if (this.isConnected) {
                const systemInfo = this.getSystemInfo();
                console.log(systemInfo);
                this.socket.emit('system info', systemInfo);
                console.log(`[${systemInfo.localTime}] System info send`);
            }
        }, this.intervalDelay);

        console.log('Start sending system info.');
    }

    stopSending() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
            console.log('Stop sending system info');
        }
    }

    cleanup() {
        this.stopSending();
        if (this.socket) {
            this.socket.disconnect();
            this.socket = null;
        }
        console.log('Cleaned up');
    }
}

const sender = new Sender();