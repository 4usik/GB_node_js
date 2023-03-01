const fs = require("fs");
const http = require('http');
const path = require("path");
const io = require('socket.io');
const crypto = require('crypto');
const { Worker } = require('worker_threads');


// сохраняем http-сервер в константу
const app = http.createServer((request, response) => {
    if (request.method === 'GET') {
        const filePath = path.join(__dirname, 'index.html');
        readStream = fs.createReadStream(filePath);
        readStream.pipe(response);
    } else if (request.method === 'POST') {
        let data = '';
        request.on('data', chunk => {
            data += chunk;
        });
        request.on('end', () => {
        const parsedData = JSON.parse(data);
        console.log(parsedData);
        response.writeHead(200, { 'Content-Type': 'json'});
        response.end(data);
        });
    } else {
        response.statusCode = 405;
        response.end();
    }
});

// инициализируем точку доступа сокета
const socket = io(app);

socket.on('connection', function (socket) {
    // генерируем ник
    crypto.randomBytes(4, (err, buf) => {
        if (err) {
            console.log('error')
        };
        const nickname = buf.toString('hex');

        // сообщения при подключении
        console.log(`New connection: client ${nickname}`);
        visitors();
        socket.on('CLIENT_MSG', (data) => {
            socket.emit('SERVER_MSG', { msg: data.msg.split('').reverse().join('')});
        });
        // сообщение для всех клиентов
        socket.broadcast.emit('NEW_CONN_EVENT', { msg: `The new client ${nickname} connected` });

        socket.on('disconnect', function () {
            visitors();
            // сообщения при отключении
            console.log(`Disconnected: user ${nickname}`);
            socket.on('CLIENT_MSG', (data) => {
                socket.emit('SERVER_MSG', { msg: data.msg.split('').reverse().join('')});
            });
            // сообщение для всех клиентов
            socket.broadcast.emit('NEW_CONN_EVENT', { msg: `The client ${nickname} disconnected` });
        });
    });
});

// счетчик посетителей
const visitors = () => {
    app.getConnections((err, count) => {
        if (err) {
            console.log('error');
        }
        console.log(`Number of visitors: ${count}`);
    });
};

const passwordSizeBytes = 4;
function start(workerData) {
    return new Promise((res, rej) => {
        const worker = new Worker('./worker.js', { workerData });
        worker.on('message', res);
        worker.on('error', rej);
    })
}
start(passwordSizeBytes)
    .then(result => console.log(result))
    .catch(err => console.error(err));

    // слушаем сервер
app.listen(3000, 'localhost');
