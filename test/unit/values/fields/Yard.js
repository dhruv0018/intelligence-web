// jshint ignore: start
import YardField from '../../../../src/values/field/Yard.js';
import YardFieldData from '../sample-data/Yard.js';

const assert  = chai.assert;
const expect  = chai.expect;
const should  = chai.should();

const tagVariable = YardFieldData.Tag;
const eventVariable = YardFieldData.Event;

describe('General Yard Field', () => {
    let tagField = new YardField(tagVariable);
    it('The Yard Class should Exist', () => {
        expect(YardField).to.exist;
    });

    it('Should have correct input type', () => {
        expect(tagField.inputType).to.exist;
        expect(tagField.inputType).to.equal('YARD');
    });

});

describe('Yard Tag Field', () => {
    it('Should be initialized correctly if required', () => {
        let localTagVariable = angular.copy(tagVariable);
        localTagVariable.isRequired = true;
        let tagField = new YardField(localTagVariable);
        let value = tagField.currentValue;
        expect(value.content).to.be.undefined;
        expect(value.name).to.equal('Select');
    });

    it('Should be initialized correctly if not required', () => {
        let localTagVariable = angular.copy(tagVariable);
        localTagVariable.isRequired = false;
        let tagField = new YardField(localTagVariable);
        let value = tagField.currentValue;
        expect(value.content).to.be.null;
        expect(value.name).to.equal('Optional');
    });

});

describe('Yard Event Field', () => {

    it('Should have properly set value if required', () => {
        let localEventVariable = angular.copy(eventVariable);
        localEventVariable.isRequired = true;
        let eventField = new YardField(localEventVariable);
        let value = eventField.currentValue;

        expect(value.content).to.equal(1);
        expect(value.name).to.equal('1');
    });

    it('toJSON should serialize to the right format if the field has a value', () => {
        let localEventVariable = angular.copy(eventVariable);
        localEventVariable.isRequired = true;
        let eventField = new YardField(localEventVariable);
        let value = eventField.currentValue;

        expect(JSON.stringify(eventField)).to.equal('{"type":null,"value":"1"}');
    });

    it('toJSON should serialize to the right format if the field has no value', () => {
        let localEventVariable = angular.copy(eventVariable);
        localEventVariable.isRequired = false;
        localEventVariable.value = undefined;

        let eventField = new YardField(localEventVariable);
        let value = eventField.currentValue;

        expect(JSON.stringify(eventField)).to.equal('{"type":null,"value":null}');
    });
});
