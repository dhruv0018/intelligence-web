// jshint ignore: start
import GapField from '../../../../src/values/field/Gap.js';
import GapFieldData from '../sample-data/Gap.js';

const assert  = chai.assert;
const expect  = chai.expect;
const should  = chai.should();

const tagVariable = GapFieldData.Tag;
const eventVariable = GapFieldData.Event;

describe('General Gap Field', () => {
    let tagField = new GapField(tagVariable);
    it('The Gap Class should Exist', () => {
        expect(GapField).to.exist;
    });

    it('Should have correct input type', () => {
        expect(tagField.inputType).to.exist;
        expect(tagField.inputType).to.equal('GAP');
    });

});

describe('Gap Tag Field', () => {
    it('Should be initialized correctly if required', () => {
        let localTagVariable = angular.copy(tagVariable);
        localTagVariable.isRequired = true;
        let tagField = new GapField(localTagVariable);
        let value = tagField.currentValue;

        expect(value.gapId).to.be.undefined;
        expect(value.name).to.be.undefined;
        expect(value.keyboardShortcut).to.be.undefined;
    });

    it('Should be initialized correctly if not required', () => {
        let localTagVariable = angular.copy(tagVariable);
        localTagVariable.isRequired = false;
        let tagField = new GapField(localTagVariable);
        let value = tagField.currentValue;

        expect(value.gapId).to.be.null;
        expect(value.name).to.equal('Optional');
        expect(value.keyboardShortcut).to.be.undefined;
    });

});

describe('Gap Event Field', () => {

    it('Should have properly set value if required', () => {
        let localEventVariable = angular.copy(eventVariable);
        localEventVariable.isRequired = true;
        let eventField = new GapField(localEventVariable);
        let value = eventField.currentValue;

        expect(value.gapId).to.equal(1);
        expect(value.name).to.equal('D Left');
        expect(value.keyboardShortcut).to.equal('DL');
    });

    it('Should set values properly', () => {
        let localEventVariable = angular.copy(eventVariable);
        localEventVariable.isRequired = true;
        let eventField = new GapField(localEventVariable);
        eventField.currentValue = eventField.availableValues[1];
        let value = eventField.currentValue;

        expect(value.gapId).to.equal(2);
        expect(value.name).to.equal('C Left');
        expect(value.keyboardShortcut).to.equal('CL');
    });

    it('toJSON should serialize to the right format if the field has a value', () => {
        let localEventVariable = angular.copy(eventVariable);
        localEventVariable.isRequired = true;
        let eventField = new GapField(localEventVariable);
        let value = eventField.currentValue;
        let serializedField = eventField.toJSON();
        expect(serializedField).to.equal('{"type":null,"value":"1"}');
    });

    it('toJSON should serialize to the right format if the field has no value', () => {
        let localEventVariable = angular.copy(eventVariable);

        localEventVariable.isRequired = false;
        localEventVariable.value = undefined;

        let eventField = new GapField(localEventVariable);
        let value = eventField.currentValue;
        let serializedField = eventField.toJSON();

        expect(serializedField).to.equal('{"type":null,"value": null}');
    });
});
