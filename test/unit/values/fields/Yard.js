// jshint ignore: start
import YardField from '../../../../src/values/field/Yard.js';
import YardFieldData from '../sample-data/Yard.js';

const assert  = chai.assert;
const expect  = chai.expect;
const should  = chai.should();

const rawField = YardFieldData;

let srcField;
let requiredField;
let unrequiredField;

beforeEach(() => {
    srcField    = angular.copy(rawField);
    requiredField = new YardField(srcField);
    srcField.isRequired = false;
    unrequiredField = new YardField(srcField);
});

describe('General Yard Field', () => {
    it('The Yard Class should Exist', () => {
        expect(YardField).to.exist;
    });
});

describe('Yard Field', () => {

    it('should set values properly', () => {
        let field = requiredField;
        let value = field.value;
        expect(value.content).to.equal(1);
        expect(value.name).to.equal('1');
    });

    it('should be able to set an optional value if the field is not required' , () => {
        let field = unrequiredField;

        field.value = field.availableValues[0];
        let value = field.value;
        expect(value.content).to.be.null;
        expect(value.name).to.equal('Yard line');
    });

    it('should validate correctly', () => {
        let field = unrequiredField;
        field.availableValues.forEach(value => {
            field.value = value;
            expect(field.valid).to.be.true;
        });
    });
});

describe('Yard.formatValueName', () => {

    it('should exist', () => expect(YardField).to.respondTo('formatValueName'));

    it('should format values > 49', () => {

        const less = 49;
        const equal = 50;
        const greater = 51;

        const field = requiredField;

        expect(field.formatValueName(less)).to.equal(less);
        expect(field.formatValueName(equal)).to.equal(equal);
        // FIXME: 100 is defined in config, should use that instead
        expect(field.formatValueName(greater)).to.equal(100 - greater);
    });
});

describe('Yard.toString', () => {

    it('should exist', () => expect(YardField).to.respondTo('toString'));

    it('should return a String', () => {

        expect(requiredField.toString()).to.be.a('string');
        expect(unrequiredField.toString()).to.be.a('string');
    });
});

describe('Yard.toJSON', () => {

    it('should serialize to the right format if the field has no value', () => {
        let field = unrequiredField;
        field.value = field.availableValues[0];

        let payload = field.toJSON();
        expect(JSON.stringify(payload)).to.equal('{"type":null,"value":null}');
    });

    it('should serialize to the right format if the field has a value', () => {
        let payload = requiredField.toJSON();
        expect(JSON.stringify(payload)).to.equal('{"type":null,"value":"1"}');
    });
});
