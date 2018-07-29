const expect = require('expect');

const {Users} = require('./users');

describe('Users', () => {
    let users;

    beforeEach(() => {
        users = new Users();
        users.users = [{
            id: '1',
            name: 'Sanya',
            room: 'Groop'
        }, {
            id: '2',
            name: 'Vlad',
            room: 'Tusa'
        }, {
            id: '3',
            name: 'Johnny',
            room: 'Groop'
        }];
    });
    it('should add new user', () => {
        let users = new Users();
        let user = {
            id: '134134',
            name: 'Sanya',
            room: 'Besida'
        };
        let resUser = users.addUser(user.id, user.name, user.room);

        expect(users.users).toEqual([user]);
    });

    it('should remove a user' ,() => {
        let userId = '1';
        let user = users.removeUser(userId);

        expect(user.id).toBe(userId);
        expect(users.users.length).toBe(2);
    });

    it('should not remove a user' ,() => {
        let userId = '99';
        let user = users.removeUser(userId);

        expect(user).toNotExist();
        expect(users.users.length).toBe(3);
    });

    it('should find user' ,() => {
        let userId = '2';
        let user = users.getUser(userId);

        expect(user.id).toBe(userId);
    });

    it('should not find user' ,() => {
        let userId = '4';
        let user = users.getUser(userId);
        expect(user).toNotExist();
    });

    it('should return names for groop', () => {
        let userList = users.getUserList('Groop');

        expect(userList).toEqual(['Sanya', 'Johnny']);
    });

    it('should return names for Tusa', () => {
        let userList = users.getUserList('Tusa');

        expect(userList).toEqual(['Vlad']);
    });
});

