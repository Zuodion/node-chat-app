const path = require('path');//модуль для легкого пути к файлу
const express = require('express');
const app = express();
const socketIO = require('socket.io');
const http = require('http');

const {generateMessage,generateLocationMessage} = require('./utils/message');
const port = process.env.PORT || 3000;
const publicPath = path.join(__dirname, '../public');
let server = http.createServer(app);
app.use(express.static(publicPath));
let io = socketIO(server);


io.on('connection', (socket)=> {//позволяет делать операции с ивентами
    console.log('New user connected');//например тригерить на нового юзера

        socket.emit('newMessage', generateMessage('Admin', 'Добро пожаловать!'));

        socket.broadcast.emit('newMessage', generateMessage('Admin', 'New User joined'));

    socket.on('createMessage', (message, callback) => {//создать и послать письмо - от клиента к серверу
        console.log('createMessage', message);
        io.emit('newMessage', generateMessage(message.from, message.text));
        callback();
    });

    socket.on('createLocationMessage', (coords) => {
        io.emit('newLocationMessage', generateLocationMessage('User', coords.latitude, coords.longitude));
    });


    socket.on('disconnect', () => {//тригерится на отключение от сервера юзера и пишет в консоль сервера
        console.log('Disconnected from server');
    });
});


server.listen(port, () => {
    console.log(`Server is up on port ${port}`);
});
//     socket.broadcast.emit('newMessage', {
//         from: message.from,
//         text: message.text,
//         createdAt: new Date().getTime
//     });
// });