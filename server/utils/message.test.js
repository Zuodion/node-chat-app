let expect = require('expect');
let {generateMessage, generateLocationMessage} = require('./message');

describe('generateMessage', () => {
    it('should generate correct message object', () => {
        let from = 'Johny';
        let text = 'Some message';
        let message = generateMessage(from, text);

        expect(message.createdAt).toBeA('number');
        expect(message).toInclude({from, text});
    })
});

describe('generateLocationMessage', () => {
    it('should generate correct location object', () => {
        let from = 'Johny';
        let lat = 123211421;
        let lon = 123143;
        let url = 'https://www.google.com/maps?q=123211421,123143';
        let message = generateLocationMessage(from, lat, lon);

        expect(message.createdAt).toBeA('number');
        expect(message).toInclude({from, url});
    });
});