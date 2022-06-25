import Jimp from 'jimp';
import {httpServer} from './src/http_server/index.js';
import robot from 'robotjs';
import { createWebSocketStream, WebSocketServer } from 'ws';
import pkg from 'robotjs';


const { getMousePos } = pkg;
const HTTP_PORT = 3000;
const WS_PORT = 8080;

console.log(`Start static http server on the ${HTTP_PORT} port!`);
httpServer.listen(HTTP_PORT);

const wsServer = new WebSocketServer({ port: WS_PORT });
// wss.on('connection', ws => {
//     ws.on('message', data => {
//         const {x, y } = robot.getMousePos();
//         ws.send(`mouse position ${x, y}`);
//     })
// })
// wss.on('close', () => {
//     console.log('exit server');
// });


wsServer.on('connection', (ws) => {
    const webSocketStream = createWebSocketStream(ws, { encoding: 'utf8', decodeStrings: false })
  
    let data = '';
  
    webSocketStream.on('readable', () => {
        data = webSocketStream.read();
        webSocketStream.emit('end');
    });
  
    webSocketStream.on('end', () => {
        if (!data) { 
            console.log('Invaled data') 
        }
        console.log(data)
        let { x, y } = robot.getMousePos();
  
        const [command, coordinatesX, coordinatesY] = data.split(' ');
        const width =+ coordinatesX;
        const height =+ coordinatesY;
        const prevValue = robot.getMousePos();
  
        if (command === 'mouse_up') {
            y -= width;
            console.log('prev y:', prevValue.y, 'cur y:', y)
            robot.moveMouse(x, y);
        }
    
        if (command === 'mouse_right') {
            x += width;
            console.log('prev x:', prevValue.x, 'cur x:', x)
            robot.moveMouse(x, y);
        }

        ws.send(command);
    });
  
        ws.on('close', (err) => {
            if (err) {
                console.log (`Error ${err}`)
            }
            console.log('server finished');
        });
    });