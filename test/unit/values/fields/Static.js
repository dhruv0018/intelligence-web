// jshint ignore: start
import StaticField from '../../../../src/values/field/Static.js';

const sampleData = {

    value: 'A String of text.',
    type: 'STATIC'
};

const assert  = chai.assert;
const expect  = chai.expect;
const should  = chai.should();

describe('Static Field', () => {

    let staticField;

    beforeEach(() => {

        let staticData = Object.assign({}, sampleData);
        staticField    = new StaticField(staticData);
    });

    it('should Exist.', () => {

        expect(StaticField).to.exist;
    });

    it('should have correct type.', () => {

        expect(staticField.type).to.exist;
        expect(staticField.type).to.equal('STATIC');
    });

    it('should be initialized correctly.', () => {

        expect(staticField.currentValue).to.equal(sampleData.value);
    });

    it('should have a toJSON method that returns the original value.', () => {

        expect(staticField.toJSON()).to.be.a('string');
        expect(staticField.toJSON()).to.equal(sampleData.value);
    });
});
