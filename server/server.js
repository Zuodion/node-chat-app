const path = require('path');//модуль для легкого пути к файлу
const express = require('express');
const app = express();
const socketIO = require('socket.io');
const http = require('http');
const {isRealString} = require('./utils/validation');
const {Users} = require('./utils/users');
const {generateMessage,generateLocationMessage} = require('./utils/message');
const port = process.env.PORT || 3000;
const publicPath = path.join(__dirname, '../public');
let server = http.createServer(app);
app.use(express.static(publicPath));
let io = socketIO(server);
let users = new Users();

io.on('connection', (socket)=> {//позволяет делать операции с ивентами
    console.log('New user connected');//например тригерить на нового юзера


    socket.on('join', (params, callback) => {
        if (!isRealString(params.name) || !isRealString(params.room)) {
            return callback ('Введите корректно имя и название комнаты!');
        }
        socket.join(params.room);
        users.removeUser(socket.id);
        users.addUser(socket.id, params.name, params.room);

        io.to(params.room).emit('updateUserList', users.getUserList(params.room));

        socket.emit('newMessage', generateMessage('Admin', 'Добро пожаловать!'));
        socket.broadcast.to(params.room).emit('newMessage', generateMessage('Admin', `${params.name} присоединяется`));
        callback()
    });

    socket.on('createMessage', (message, callback) => {//создать и послать письмо - от клиента к серверу
        let user = users.getUser(socket.id);

        if (user && isRealString(message.text)) {
            io.to(user.room).emit('newMessage', generateMessage(user.name, message.text));

        }

        callback();
    });

    socket.on('createLocationMessage', (coords) => {
        let user = users.getUser(socket.id);
        io.to(user.room).emit('newLocationMessage', generateLocationMessage(user.name, coords.latitude, coords.longitude));
    });


    socket.on('disconnect', () => {//тригерится на отключение от сервера юзера и пишет в консоль сервера
        let user = users.removeUser(socket.id);
        if (user) {
            io.to(user.room).emit('updateUserList', users.getUserList(user.room));
            io.to(user.room).emit('newMessage', generateMessage('Admin', `${user.name} вышел.`));
        }
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