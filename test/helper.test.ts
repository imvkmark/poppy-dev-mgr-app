// @ts-ignore
import assert from 'assert';
import { isSimplePwd, pyWarning, regexTest, sprintf } from '../src/services/utils/helper';

describe('regex', function () {
    it('test-number', function () {
        assert.equal(regexTest(['5', '7'], /^\d+$/i), false);
        assert.equal(regexTest(['5'], /^\d+$/i), true);
        assert.equal(regexTest('5', /^\d+$/i), true);
        assert.equal(regexTest('5,7', /^\d+$/i), false);
    });
    it('test-string', function () {
        expect(regexTest('1', /\S/)).toBe(true);
    });
});


describe('string', function () {
    describe('sprintf', function () {
        it('replace 1 param', function () {
            assert.equal('你是什么', sprintf('{0}是什么', '你'));
        });
        it('replace 2 param', function () {
            assert.equal('你是什么', sprintf('{0}是什{1}', '你', '么'));
        });
    });
});


describe('project', function () {
    it('is-simple_pwd', function () {
        assert.equal(isSimplePwd('12345'), false);
        assert.equal(isSimplePwd('12345678901234567'), false);
        assert.equal(isSimplePwd('1zA*_.[]-!@$%^'), true);
        assert.equal(isSimplePwd('-!@#$%^&()~Nk03s'), true);
        assert.equal(isSimplePwd(' 1255NKU'), false);
    });
});
