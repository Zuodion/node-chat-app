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

socket.on('newLocationMessage', (message) => {
    let li = jQuery('<li></li>');
    let a = jQuery('<a target="_blank">My current location</a>');//blank - с нового окна
    li.text(`${message.from}: `);
    a.attr('href', message.url);//attr Получает/устанавливает значение атрибутов выбранных элементов(кароче заменяет href на message.url)
    li.append(a);
    jQuery('#messages').append(li);
});

jQuery('#message-form').on('submit', (e) => {//событие submit и функция, которая выполняется после submit
    e.preventDefault();//кароче делает так чтобы в командной строке не образовывалось сообщение которое мы сабмитнули
    socket.emit('createMessage', {//отправка от сервера к клиенту
        from: 'User',
        text: jQuery('[name=message]').val(),//селектор до поля, куди вводиться повідомлення, получает значение, что ввели в name=message
    }, () => {
        jQuery('#message-form')[0].reset();//очистка формы после отправки
    });


});

let locationButton = jQuery('#send-location');
locationButton.on('click', () => {
    if (!navigator.geolocation) {
        return alert('Geolocation not supported by your browser');
    }

    navigator.geolocation.getCurrentPosition( (position) => {
    socket.emit('createLocationMessage', {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude
    });
    }, () => {
        alert('Unable to fetch location');
    });
});