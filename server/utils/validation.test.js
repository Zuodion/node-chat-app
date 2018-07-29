const expect = require('expect');
let {isRealString} = require('./validation');

describe('isRealString', () => {
    it('should reject non string values', () => {
        let res = isRealString(234);
        expect(res).toBe(false);

    });
    it('should reject string with only spaces', () => {
        let res = isRealString('   ');
        expect(res).toBe(false);
    });
    it('should allow string with non-space character', () => {
        let res = isRealString('   Sanya  ');
        expect(res).toBe(true);
    });
});

