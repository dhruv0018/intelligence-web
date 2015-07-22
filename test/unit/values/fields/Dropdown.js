// jshint ignore: start
import DropdownFieldData from '../sample-data/Dropdown.js';
import DropdownField from '../../../../src/values/field/Dropdown.js';

const assert  = chai.assert;
const expect  = chai.expect;
const should  = chai.should();

const tagVariable = DropdownFieldData.Tag;
const eventVariable = DropdownFieldData.Event;

describe('General Dropdown Field', () => {
    let tagField = new DropdownField(tagVariable);
    it('The DropdownField Class should Exist', () => {
        expect(DropdownField).to.exist;
    });

    it('Should have correct input type', () => {
        expect(tagField.inputType).to.exist;
        expect(tagField.inputType).to.equal('DROPDOWN');
    });

});

describe('Dropdown Tag Field', () => {
    it('Should be initialized correctly if required', () => {
        let localTagVariable = angular.copy(tagVariable);
        localTagVariable.isRequired = true;
        let tagField = new DropdownField(localTagVariable);
        let value = tagField.currentValue;

        expect(value.content).to.be.undefined;
        expect(value.name).to.equal('Select');
    });

    it('Should be initialized correctly if not required', () => {
        let localTagVariable = angular.copy(tagVariable);
        localTagVariable.isRequired = false;
        let tagField = new DropdownField(localTagVariable);
        let value = tagField.currentValue;

        expect(value.name).to.equal('Optional');
        expect(value.content).to.be.null;
    });

});

describe('Dropdown Event Field', () => {

    it('Should have properly set value if required', () => {
        let localEventVariable = angular.copy(eventVariable);
        localEventVariable.isRequired = true;
        let eventField = new DropdownField(localEventVariable);
        let value = eventField.currentValue;

        expect(value.content).to.equal('Normal');
        expect(value.name).to.equal('Normal');
    });

    it('Should set values properly', () => {
        let localEventVariable = angular.copy(eventVariable);
        localEventVariable.isRequired = true;
        let eventField = new DropdownField(localEventVariable);
        eventField.currentValue = eventField.availableValues[2];
        let value = eventField.currentValue;

        expect(value.content).to.equal('Onside');
        expect(value.name).to.equal('Onside');
    });

    it('toJSON should serialize to the right format if the field has a value', () => {
        let localEventVariable = angular.copy(eventVariable);
        localEventVariable.isRequired = true;
        let eventField = new DropdownField(localEventVariable);
        let value = eventField.currentValue;

        expect(JSON.stringify(eventField)).to.equal('{"type":null,"value":"Normal"}');
    });

    it('toJSON should serialize to the right format if the field has no value', () => {
        let localEventVariable = angular.copy(eventVariable);
        localEventVariable.isRequired = false;
        localEventVariable.value = undefined;

        let eventField = new DropdownField(localEventVariable);
        let value = eventField.currentValue;

        expect(JSON.stringify(eventField)).to.equal('{"type":null,"value":null}');
    });

    it('Should be able to switch back to an optional value from a set value', () => {
        let localEventVariable = angular.copy(eventVariable);
        localEventVariable.isRequired = false;
        let eventField = new DropdownField(localEventVariable);
        let value = eventField.currentValue;
        expect(value.content).to.not.be.null;
        eventField.currentValue = eventField.availableValues[0];
        value = eventField.currentValue;
        expect(value.content).to.be.null;
    });
});
