// jshint ignore: start
import Field from '../../../../src/values/field/Field.js';
import FieldData from '../sample-data/Field.js';

const assert  = chai.assert;
const expect  = chai.expect;
const should  = chai.should();

const rawVariableValue = FieldData;

describe('Field Value', () => {

    let field;

    beforeEach(angular.mock.module('intelligence-web-client'));

    beforeEach( () => {
        field = new Field(rawVariableValue);
    });

    it('The Field Class should Exist', () => {

        expect(Field).to.exist;
    });

    it('The Field Class has appropriate properties expected from the model', () => {
        assert.isDefined(field.id, 'The id property is defined');
        assert.isDefined(field.type, 'The type property is defined');
        assert.isDefined(field.isRequired, 'The isRequired property is defined');
    });
});
