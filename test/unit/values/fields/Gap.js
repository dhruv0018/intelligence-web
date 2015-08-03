// jshint ignore: start
import GapField from '../../../../src/values/field/Gap.js';
import GapFieldData from '../sample-data/Gap.js';

const assert  = chai.assert;
const expect  = chai.expect;
const should  = chai.should();

const rawField = GapFieldData;

describe('General Gap Field', () => {
    it('The Gap Class should Exist', () => {
        expect(GapField).to.exist;
    });
});

describe('Gap Field', () => {
    let srcField;
    let requiredField;
    let unrequiredField;

    beforeEach(() => {
        srcField    = angular.copy(rawField);
        requiredField = new GapField(srcField);
        srcField.isRequired = false;
        unrequiredField = new GapField(srcField);
    });

    it('Should set values properly', () => {
        let field = requiredField;
        let value = field.value;
        expect(value.gapId).to.equal(1);
        expect(value.name).to.equal('D Left');
        expect(value.keyboardShortcut).to.equal('DL');
    });

    it('Should be able to set an optional value if the field is not required' , () => {
        let field = unrequiredField;

        field.value = field.availableValues[0];
        let value = field.value;
        expect(value.gapId).to.be.null;
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
