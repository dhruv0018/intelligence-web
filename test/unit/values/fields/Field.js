// jshint ignore: start
import Field from '../../../../src/values/field/Field.js';
import FieldData from '../sample-data/Field.js';

const assert  = chai.assert;
const expect  = chai.expect;
const should  = chai.should();

const rawVariableValue = FieldData;

describe('Generic Field', () => {

    let field;
    let testString = 'Test String.';

    beforeEach(angular.mock.module('intelligence-web-client'));

    beforeEach( () => {
        field = new Field(rawVariableValue);
    });

    it('should Exist', () => {

        expect(Field).to.exist;
    });

    it('should have public API', () => {

        expect(Field).to.respondTo('initialize');
        expect(Field).to.respondTo('toString');
        expect(Field).to.respondTo('toJSON');
    });

    it('should have a getter, "currentValue", for the "value" property.', () => {

        field.value = testString;

        expect(field.currentValue).to.equal(testString);
    });

    it('should have a setter, "currentValue", for the "value" property.', () => {

        field.currentValue = testString;

        expect(field.value).to.equal(testString);
    });

    it('the "initialize" method should sets the value property', () => {

        field.initialize(testString);

        expect(field.currentValue).to.equal(testString);
    });

    it('has appropriate properties expected from the model', () => {
        assert.isDefined(field.id, 'The id property is defined');
        assert.isDefined(field.type, 'The type property is defined');
        assert.isDefined(field.isRequired, 'The isRequired property is defined');
    });
});
