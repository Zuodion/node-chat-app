[{
    id: '/$fe4we4fefrfe',
    name: 'Sanya',
    room: 'Lalki'
}]

// class Person{
//     constructor (name, age) {//функция
//         this.name = name;
//         this.age = age;
//     }
//     getUserDescription () {
//         return `${this.name} is ${this.age} year(s) old.`;
//     }
// }
// let me = new Person('Sanya', 20);
// let description = me.getUserDescription();
// console.log(description);

class Users {
    constructor () {
        this.users = [];
    }
    addUser (id, name, room) {
        let user = {id, name, room};
        this.users.push(user);
        return user;
    }
    removeUser (id) {
        let user = this.getUser(id);
        this.users = this.users.filter((user) => {
            return user.id !== id;
        });
        return user;
    }
    getUser(id) {
        return this.users.filter((user) => user.id === id)[0]
    };
    getUserList (room) {
        let users = this.users.filter((user) => {
            return user.room === room;//проверяет, есть ли пользователь в комнате
        });
        let namesArray = users.map ((user) => {//map почти filter
            return user.name;
        });
        return namesArray;//возвращает имя в качестве элемента массива users
    }

}
module.exports = {Users};