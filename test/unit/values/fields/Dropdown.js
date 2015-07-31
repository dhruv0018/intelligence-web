// jshint ignore: start
import DropdownFieldData from '../sample-data/Dropdown.js';
import DropdownField from '../../../../src/values/field/Dropdown.js';

const assert  = chai.assert;
const expect  = chai.expect;
const should  = chai.should();

const rawField = DropdownFieldData;

describe('General Dropdown Field', () => {
    it('The DropdownField Class should Exist', () => {
        expect(DropdownField).to.exist;
    });
});

describe('Dropdown Field', () => {
    let srcField;
    let requiredField;
    let unrequiredField;

    beforeEach(() => {
        srcField    = angular.copy(rawField);
        requiredField = new DropdownField(srcField);
        srcField.isRequired = false;
        unrequiredField = new DropdownField(srcField);
    });

    it('Should set values properly', () => {
        let field = requiredField;

        field.value = field.availableValues[1];
        let value = field.value;

        expect(value.content).to.equal('Onside');
        expect(value.name).to.equal('Onside');
    });

    it('Should be able to set an optional value if the field is not required' , () => {
        let field = unrequiredField;

        field.value = field.availableValues[0];
        let value = field.value;

        expect(value.content).to.be.null;
        expect(value.name).to.equal('Optional');
    });

    it('Should have properly set value if required', () => {
        let field = requiredField;
        field.isRequired = true;

        let value = field.value;
        expect(value.content).to.equal('Normal');
        expect(value.name).to.equal('Normal');
    });

    it('toJSON should serialize to the right format if the field has a value', () => {
        let payload = requiredField.toJSON();
        expect(JSON.stringify(payload)).to.equal('{"type":null,"value":"Normal"}');
    });

    it('toJSON should serialize to the right format if the field has no value', () => {
        let field = unrequiredField;
        field.value = field.availableValues[0];

        let payload = field.toJSON();
        expect(JSON.stringify(payload)).to.equal('{"type":null,"value":null}');
    });

    it('Should validate correctly', () => {
        let field = unrequiredField;
        field.availableValues.forEach(value => {
            field.value = value;
            expect(field.valid).to.be.true;
        });
    });
});
