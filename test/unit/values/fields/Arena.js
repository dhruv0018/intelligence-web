// jshint ignore: start
import ArenaFieldData from '../sample-data/Arena.js';
import ArenaField from '../../../../src/values/field/Arena.js';

const assert  = chai.assert;
const expect  = chai.expect;
const should  = chai.should();
const rawField = ArenaFieldData;

//todo add more later when I find out about arena stuff
describe('General Arena Field', () => {
    it('The ArenaField Class should Exist', () => {
        expect(ArenaField).to.exist;
    });
});

describe('Arena Field', () => {
    let srcField;
    let requiredField;

    beforeEach(() => {
        srcField    = angular.copy(rawField);
        requiredField = new ArenaField(srcField);
    });

    it('Should set values properly', () => {
        let field = requiredField;
        let value = field.value;

        expect(value.region).to.equal(1);
        expect(value.coordinates.x).to.equal(10);
        expect(value.coordinates.y).to.equal(10);
    });

    it('toJSON should serialize to the right format if the field has a value', () => {
        let payload = requiredField.toJSON();
        let variableValue = {
            type: null,
            value: rawField.value
        };
        let expectedString = JSON.stringify(variableValue);
        expect(JSON.stringify(payload)).to.equal(expectedString);
    });

    it('Should validate correctly', () => {
        let field = requiredField;
        expect(field.valid).to.be.true;
    });
});
