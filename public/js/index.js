let socket = io();

socket.on('connect', () => {// тоже прослушивание нового ивента(тригерится на подключение к серверу), но пишет это в консоле браузера(со стороны юзера)
    console.log('Connected to server');

});

socket.on('disconnect', () => {//тригерится на отключение от сервера(со стороны юзера)
    console.log('Disconnected from server');
});

socket.on('newMessage', (message) => {
    console.log('New message', message);//клиент посылает на сервер сообщение, а ниже jQuery обрабатывает и помещает его
    let li = jQuery('<li></li>');//li - новая форма
    li.text(`${message.from}: ${message.text}`);// собственно придание li формы от кого, и сам текст
    jQuery('#messages').append(li);//добавление в список сообщений с id(номером) который берется из index.html<ol>
});

jQuery('#message-form').on('submit', (e) => {//событие submit и функция, которая выполняется после submit
    e.preventDefault();//кароче делает так чтобы в командной строке не образовывалось сообщение которое мы сабмитнули

    socket.emit('createMessage', {
        from: 'User',
        text: jQuery('[name=message]').val()//селектор до поля, куди вводиться повідомлення
    }, () => {

    })
});