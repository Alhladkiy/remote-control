import Jimp from 'jimp';
import {httpServer} from './src/http_server/index.js';
import robot from 'robotjs';
import { WebSocketServer } from 'ws';


const HTTP_PORT = 3000;
const WS_PORT = 8080;

const wss = new WebSocketServer({ port: WS_PORT });
wss.on('connection', (ws) => {
    ws.on('message', (message) => {
        console.log('hello i am websocket')
    })
    wss.on('close', () => {
        console.log('exit server');
    });
})

console.log(`Start static http server on the ${HTTP_PORT} port!`);
httpServer.listen(HTTP_PORT);

// console.log(robot.getMousePos())
