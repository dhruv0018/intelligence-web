// jshint ignore: start
import TextField from '../../../../src/values/field/Text.js';
import TextFieldData from '../sample-data/Text.js';

const assert  = chai.assert;
const expect  = chai.expect;
const should  = chai.should();

const tagVariable = TextFieldData.Tag;
const eventVariable = TextFieldData.Event;

describe('General Text Field', () => {
    let tagField = new TextField(tagVariable);
    it('The Text Class should Exist', () => {
        expect(TextField).to.exist;
    });
});

describe('Text Tag Field', () => {
    it('Should be initialized correctly if required', () => {
        let localTagVariable = angular.copy(tagVariable);
        localTagVariable.isRequired = true;
        let tagField = new TextField(localTagVariable);
        let value = tagField.currentValue;
        expect(value.content).to.be.undefined;
        expect(value.name).to.equal('Select');
    });

    it('Should be initialized correctly if not required', () => {
        let localTagVariable = angular.copy(tagVariable);
        localTagVariable.isRequired = false;
        let tagField = new TextField(localTagVariable);
        let value = tagField.currentValue;
        expect(value.content).to.be.null;
        expect(value.name).to.equal('Optional');
    });

});

describe('Text Event Field', () => {

    it('Should have properly set value if required', () => {
        let localEventVariable = angular.copy(eventVariable);
        localEventVariable.isRequired = true;
        let eventField = new TextField(localEventVariable);
        let value = eventField.currentValue;

        expect(value.content).to.equal('abc');
        expect(value.name).to.equal('abc');
    });

    it('toJSON should serialize to the right format if the field has a value', () => {
        let localEventVariable = angular.copy(eventVariable);
        localEventVariable.isRequired = true;
        let eventField = new TextField(localEventVariable);
        let value = eventField.currentValue;

        expect(JSON.stringify(eventField)).to.equal('{"type":null,"value":"abc"}');
    });

    it('toJSON should serialize to the right format if the field has no value', () => {
        let localEventVariable = angular.copy(eventVariable);
        localEventVariable.isRequired = false;
        localEventVariable.value = undefined;

        let eventField = new TextField(localEventVariable);
        let value = eventField.currentValue;

        expect(JSON.stringify(eventField)).to.equal('{"type":null,"value":null}');
    });
});
