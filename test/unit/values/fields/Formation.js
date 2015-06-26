// jshint ignore: start
import FormationField from '../../../../src/values/field/Formation.js';
import FormationFieldData from '../sample-data/Formation.js';

const assert  = chai.assert;
const expect  = chai.expect;
const should  = chai.should();

const tagVariable = FormationFieldData.Tag;
const eventVariable = FormationFieldData.Event;

describe('General Formation Field', () => {
    let tagField = new FormationField(tagVariable);
    it('The Formation Class should Exist', () => {
        expect(FormationField).to.exist;
    });

    it('Should have correct input type', () => {
        expect(tagField.inputType).to.exist;
        expect(tagField.inputType).to.equal('FORMATION');
    });

});

describe('Formation Tag Field', () => {
    it('Should be initialized correctly if required', () => {
        let localTagVariable = angular.copy(tagVariable);
        localTagVariable.isRequired = true;
        let tagField = new FormationField(localTagVariable);
        let value = tagField.currentValue;

        expect(value.formationId).to.be.undefined;
        expect(value.name).to.equal('Select');
    });

    it('Should be initialized correctly if not required', () => {
        let localTagVariable = angular.copy(tagVariable);
        localTagVariable.isRequired = false;
        let tagField = new FormationField(localTagVariable);
        let value = tagField.currentValue;
        expect(value.formationId).to.be.null;
        expect(value.name).to.equal('Optional');
    });

});

describe('Formation Event Field', () => {

    it('Should have properly set value if required', () => {
        let localEventVariable = angular.copy(eventVariable);
        localEventVariable.isRequired = true;
        let eventField = new FormationField(localEventVariable);
        let value = eventField.currentValue;

        expect(value.formationId).to.equal(1);
        expect(value.name).to.equal('Empty');
    });

    it('Should set values properly', () => {
        let localEventVariable = angular.copy(eventVariable);
        localEventVariable.isRequired = true;
        let eventField = new FormationField(localEventVariable);
        eventField.currentValue = eventField.availableValues[2];
        let value = eventField.currentValue;

        expect(value.formationId).to.equal(2);
        expect(value.name).to.equal('Ace');
    });

    it('toJSON should serialize to the right format if the field has a value', () => {
        let localEventVariable = angular.copy(eventVariable);
        localEventVariable.isRequired = true;
        let eventField = new FormationField(localEventVariable);
        let value = eventField.currentValue;
        let serializedField = eventField.toJSON();
        expect(serializedField).to.equal('{"type":null,"value":"1"}');
    });

    it('toJSON should serialize to the right format if the field has no value', () => {
        let localEventVariable = angular.copy(eventVariable);
        localEventVariable.isRequired = false;
        localEventVariable.value = undefined;

        let eventField = new FormationField(localEventVariable);
        let value = eventField.currentValue;
        let serializedField = eventField.toJSON();

        expect(serializedField).to.equal('{"type":null,"value":null}');
    });

    it('Should be able to switch back to an optional value from a set value', () => {
        let localEventVariable = angular.copy(eventVariable);
        localEventVariable.isRequired = false;
        let eventField = new FormationField(localEventVariable);
        let value = eventField.currentValue;        
        expect(value.formationId).to.not.be.null;
        eventField.currentValue = eventField.availableValues[0];
        value = eventField.currentValue;
        expect(value.formationId).to.be.null;
    });
});
