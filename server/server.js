const path = require('path');//модуль для легкого пути к файлу
const express = require('express');
const app = express();
const socketIO = require('socket.io');
const http = require('http');

const port = process.env.PORT || 3000;
const publicPath = path.join(__dirname, '../public');
let server = http.createServer(app);
app.use(express.static(publicPath));
let io = socketIO(server);


io.on('connection', (socket)=> {//позволяет делать операции с ивентами
    console.log('New user connected');//например тригерить на нового юзера

    socket.emit('newMessage', {//Новое письмо - сервер шлет клиенту
        from: 'He-man',
        text: 'Hey. Whats going on',
        createdAt: new Date().toString()
    });

    socket.on('createMessage', (message) => {//создать и послать письмо - от клиента к серверу
        console.log('createMessage', message);
    });

    socket.on('disconnect', () => {//тригерится на отключение от сервера юзера и пишет в консоль сервера
        console.log('Disconnected from server');
    });
});


server.listen(port, () => {
    console.log(`Server is up on port ${port}`);
});