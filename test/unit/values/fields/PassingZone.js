// jshint ignore: start
import PassingZoneField from '../../../../src/values/field/PassingZone.js';
import PassingZoneFieldData from '../sample-data/PassingZone.js';

const assert  = chai.assert;
const expect  = chai.expect;
const should  = chai.should();

const rawField = PassingZoneFieldData;

describe('General PassingZone Field', () => {
    it('The DropdownField Class should Exist', () => {
        expect(PassingZoneField).to.exist;
    });
});

describe('Passing Zone Field', () => {
    let srcField;
    let requiredField;
    let unrequiredField;

    beforeEach(() => {
        srcField    = angular.copy(rawField);
        requiredField = new PassingZoneField(srcField);
        srcField.isRequired = false;
        unrequiredField = new PassingZoneField(srcField);
    });

    it('Should set values properly', () => {
        let field = requiredField;
        let value = field.value;
        expect(value.zoneId).to.equal(1);
        expect(value.name).to.equal('Loss Far Left');
        expect(value.keyboardShortcut).to.equal('FL');
    });

    it('Should be able to set an optional value if the field is not required' , () => {
        let field = unrequiredField;

        field.value = field.availableValues[0];
        let value = field.value;
        expect(value.zoneId).to.be.null;
        expect(value.name).to.equal('Passing Zone');
    });

    it('toJSON should serialize to the right format if the field has a value', () => {
        let payload = requiredField.toJSON();
        expect(JSON.stringify(payload)).to.equal('{"type":null,"value":"1"}');
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
