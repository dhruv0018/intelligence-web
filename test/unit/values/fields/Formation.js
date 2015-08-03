// jshint ignore: start
import FormationField from '../../../../src/values/field/Formation.js';
import FormationFieldData from '../sample-data/Formation.js';

const assert  = chai.assert;
const expect  = chai.expect;
const should  = chai.should();

const rawField = FormationFieldData;

describe('General Formation Field', () => {
    it('The Formation Class should Exist', () => {
        expect(FormationField).to.exist;
    });
});

describe('Formation Field', () => {
    let srcField;
    let requiredField;
    let unrequiredField;

    beforeEach(() => {
        srcField    = angular.copy(rawField);
        requiredField = new FormationField(srcField);
        srcField.isRequired = false;
        unrequiredField = new FormationField(srcField);
    });

    it('Should set values properly', () => {
        let field = requiredField;
        let value = field.value;
        expect(value.formationId).to.equal(1);
        expect(value.name).to.equal('Empty');
        expect(value.numberPlayers).to.equal(6);
    });

    it('Should be able to set an optional value if the field is not required' , () => {
        let field = unrequiredField;

        field.value = field.availableValues[0];
        let value = field.value;
        expect(value.formationId).to.be.null;
        expect(value.name).to.equal('Optional');
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
