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

describe.only('Arena Field', () => {
    let srcField;
    let requiredField;
    let unrequiredField;

    beforeEach(() => {
        srcField    = angular.copy(rawField);
        requiredField = new ArenaField(srcField);
        srcField.isRequired = false;
        unrequiredField = new ArenaField(srcField);
    });

    it('Should set values properly', () => {
        let field = requiredField;
        let value = field.value;

        expect(value.regionId).to.equal(1);
        expect(value.coordinates.x).to.equal(10);
        expect(value.coordinates.y).to.equal(10);
    });

    it('toJSON should serialize to the right format if the field has a value', () => {
        let payload = requiredField.toJSON();
        expect(JSON.stringify(payload)).to.equal('{"type":null,"value":{"coordinates":{"x":10,"y":10},"region":1}}');
    });

    it('toJSON should serialize to the right format if the field has no value', () => {
        let field = unrequiredField;
        field.clear();

        let payload = field.toJSON();
        expect(JSON.stringify(payload)).to.equal('{"type":null,"value":{"coordinates":{"x":null,"y":null},"region":null}}');
    });

    it('Should validate correctly', () => {
        let field = unrequiredField;
        let value = field.value;
        expect(field.valid).to.be.true;
    });
});
