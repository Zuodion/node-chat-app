let socket = io();

function scrollToBottom() {
    // Selectors
    let messages = jQuery('#messages');
    let newMessage = messages.children('li:last-child');//последний наследник элемента li
    //Height
    let clientHeight = messages.prop('clientHeight');
    let scrollTop = messages.prop('scrollTop');
    let scrollHeight = messages.prop('scrollHeight');
    let newMessageHeight = newMessage.innerHeight();
    let lastMessageHeight = newMessage.prev().innerHeight();

    if (clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight) {
        messages.scrollTop(scrollHeight);
    }
}

socket.on('connect', () => {// тоже прослушивание нового ивента(тригерится на подключение к серверу), но пишет это в консоле браузера(со стороны юзера)
    let params = jQuery.deparam(window.location.search);//deparam - библиотека, которая вытягивает из url и превращает их в объект
    socket.emit('join', params, (err) => {
        if (err) {
            alert(err);//если юзер неправильно ввел имя или комнату, то ему напишет ошибку и вернет на домашнюю страницу
            window.location.href = '/'
        } else {
            console.log('No error');

        }
    });
});

socket.on('disconnect', () => {//тригерится на отключение от сервера(со стороны юзера)
    console.log('Disconnected from server');
});

socket.on('updateUserList', (users) => {
    let ol = jQuery('<ol></ol>');

    users.forEach(function (user) {
        ol.append(jQuery('<li></li>').text(user));
    });
    jQuery('#users').html(ol);//обновляет список пользователей
});

socket.on('newMessage', (message) => {
    let formattedTime = moment(message.createdAt).format('H:mm');//отсылает время
    let template = jQuery('#message-template').html();//вытягивает шаблон из index.html
    let html = Mustache.render(template, {//рендер - создает следующее сообщение по шаблону template
        createdAt: formattedTime,
        from: message.from,
        text: message.text
    });

    jQuery('#messages').append(html);//добавляет выше собраное сообщение
    scrollToBottom();
//     let li = jQuery('<li></li>');//li - новая форма
//     li.text(`${formattedTime} ${message.from}: ${message.text}`);// собственно придание li формы от кого, и сам текст
//     jQuery('#messages').append(li);//добавление в список сообщений с id(номером) который берется из index.html<ol>
});

socket.on('newLocationMessage', (message) => {
    let formattedTime = moment(message.createdAt).format('H:mm');//отсылает время
    let template = jQuery('#location-message-template').html();//вытягивает шаблон из index.html
    let html = Mustache.render(template, {
        createdAt: formattedTime,
        from: message.from,
        url: message.url
    });
    jQuery('#messages').append(html);
    scrollToBottom();
    // let li = jQuery('<li></li>');
    // let a = jQuery('<a target="_blank">Я здесь</a>');//blank - с нового окна
    // li.text(`${formattedTime} ${message.from}: `);
    // a.attr('href', message.url);//attr Получает/устанавливает значение атрибутов выбранных элементов(кароче заменяет href на message.url)
    // li.append(a);
});

jQuery('#message-form').on('submit', (e) => {//событие submit и функция, которая выполняется после submit
    e.preventDefault();//делает так чтобы в командной строке не образовывалось сообщение которое мы сабмитнули
    let messageTextbox = jQuery('[name=message]');

    socket.emit('createMessage', {//отправка от сервера к клиенту
        from: undefined,//потому что и так заменится
        text: messageTextbox.val(),//селектор до поля, куди вводиться повідомлення, получает значение, что ввели в name=message
    }, () => {
        messageTextbox.val('');//очистка формы после отправки
    });


});

let locationButton = jQuery('#send-location');
locationButton.on('click', () => {
    if (!navigator.geolocation) {
        return alert('Geolocation not supported by your browser');
    }

    locationButton.attr('disabled', 'disabled').text('Отправка местоположения');

    navigator.geolocation.getCurrentPosition( (position) => {
        locationButton.removeAttr('disabled').text('Расказать о своём местоположении');//отключает кнопку на время получения координат
        socket.emit('createLocationMessage', {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        });
        }, () => {
        locationButton.removeAttr('disabled').text('Расказать о своём местоположении');
        alert('Unable to fetch location');
    });
});