let socket = io();

socket.on('connect', () => {// тоже прослушивание нового ивента(тригерится на подключение к серверу), но пишет это в консоле браузера(со стороны юзера)
    console.log('Connected to server');


    socket.emit('createMessage', {//клиент отсылает на сервер новое письмо
        to: 'jen@example.com',
        text: 'Hey. This is Sanya'
    });
});

socket.on('disconnect', () => {//тригерится на отключение от сервера(со стороны юзера)
    console.log('Disconnected from server');
});

socket.on('newMessage', (message) => {//сервер шлет клиенту
    console.log('New message', message);
});