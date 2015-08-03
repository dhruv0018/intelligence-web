// jshint ignore: start
import Field from '../../../../src/values/field/Field.js';
import rawFieldData from '../sample-data/Field.js';

const assert  = chai.assert;
const expect  = chai.expect;
const should  = chai.should();

const rawVariableValue = rawFieldData;

describe('Generic Field', () => {

    let field;
    let testString = '1';

    beforeEach(angular.mock.module('intelligence-web-client'));

    beforeEach( () => {
        field = new Field(rawVariableValue);
    });

    it('should Exist', () => {

        expect(Field).to.exist;
    });

    it('should have public API', () => {
        expect(Field).to.respondTo('toString');
        expect(Field).to.respondTo('toJSON');
        expect(Field).to.respondTo('initializeValue');
    });

    it('should have a value getter', () => {

        field.value = testString;

        expect(field.value).to.equal(testString);
    });

    it('should have a value setter', () => {

        field.value = testString;

        expect(field.value).to.equal(testString);
    });

    it('should initialize the value correctly via the "initializeValue" method', () => {
        let value = field.initializeValue(testString, String);
        expect(value).to.equal(testString);

        value = field.initializeValue(1);
        expect(value).to.equal(1);
    });

    it('has appropriate properties expected from the model', () => {
        assert.isDefined(field.id, 'The id property is defined');
        assert.isDefined(field.type, 'The type property is defined');
        assert.isDefined(field.isRequired, 'The isRequired property is defined');
    });

});
