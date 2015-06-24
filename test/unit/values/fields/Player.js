// jshint ignore: start
//import PlayerField from '../../../../src/values/field/Player.js';
import PlayerFieldData from '../sample-data/Player.js';

const assert  = chai.assert;
const expect  = chai.expect;
const should  = chai.should();

const tagVariable = PlayerFieldData.Tag;
const eventVariable = PlayerFieldData.Event;

beforeEach(angular.mock.module('intelligence-web-client'));

beforeEach( inject(function(PlayerField){
  console.log(PlayerField);
}));


// describe('General Player Field', () => {
//     let tagField = new PlayerField(tagVariable);
//     it('The Player Class should Exist', () => {
//         expect(PlayerField).to.exist;
//     });
//
//     it('Should have correct input type', () => {
//         expect(tagField.inputType).to.exist;
//         expect(tagField.inputType).to.equal('PLAYER');
//     });
//
// });

// describe('Player Tag Field', () => {
//     it('Should be initialized correctly if required', () => {
//         let localTagVariable = angular.copy(tagVariable);
//         localTagVariable.isRequired = true;
//         let tagField = new PlayerField(localTagVariable);
//         let value = tagField.currentValue;
//
//         expect(value.playerId).to.be.undefined;
//         expect(value.name).to.equal('Select');
//         expect(value.keyboardShortcut).to.be.undefined;
//     });
//
//     it('Should be initialized correctly if not required', () => {
//         let localTagVariable = angular.copy(tagVariable);
//         localTagVariable.isRequired = false;
//         let tagField = new PlayerField(localTagVariable);
//         let value = tagField.currentValue;
//
//         expect(value.playerId).to.be.null;
//         expect(value.name).to.equal('Optional');
//         expect(value.keyboardShortcut).to.be.undefined;
//     });
//
// });
//
// describe('Player Event Field', () => {
//
//     it('Should have properly set value if required', () => {
//         let localEventVariable = angular.copy(eventVariable);
//         localEventVariable.isRequired = true;
//         let eventField = new PlayerField(localEventVariable);
//         let value = eventField.currentValue;
//
//         expect(value.playerId).to.equal(1);
//         expect(value.name).to.equal('Loss Far Left');
//         expect(value.keyboardShortcut).to.equal('FL');
//     });
//
//     it('Should set values properly', () => {
//         let localEventVariable = angular.copy(eventVariable);
//         localEventVariable.isRequired = true;
//         let eventField = new PlayerField(localEventVariable);
//         eventField.currentValue = eventField.availableValues[2];
//         let value = eventField.currentValue;
//
//         expect(value.gapId).to.equal(2);
//         expect(value.name).to.equal('Loss Left');
//         expect(value.keyboardShortcut).to.equal('LL');
//     });
//
//     it('toJSON should serialize to the right format if the field has a value', () => {
//         let localEventVariable = angular.copy(eventVariable);
//         localEventVariable.isRequired = true;
//         let eventField = new PlayerField(localEventVariable);
//         let value = eventField.currentValue;
//         let serializedField = eventField.toJSON();
//         expect(serializedField).to.equal('{"type":null,"value":"1"}');
//     });
//
//     it('toJSON should serialize to the right format if the field has no value', () => {
//         let localEventVariable = angular.copy(eventVariable);
//         localEventVariable.isRequired = false;
//         localEventVariable.value = undefined;
//
//         let eventField = new PlayerField(localEventVariable);
//         let value = eventField.currentValue;
//         let serializedField = eventField.toJSON();
//
//         expect(serializedField).to.equal('{"type":null,"value":null}');
//     });
//
//     it('Should be able to switch back to an optional value from a set value', () => {
//         let localEventVariable = angular.copy(eventVariable);
//         localEventVariable.isRequired = false;
//         let eventField = new PlayerField(localEventVariable);
//         let value = eventField.currentValue;
//         expect(value.playerId).to.not.be.null;
//         eventField.currentValue = eventField.availableValues[0];
//         value = eventField.currentValue;
//         expect(value.playerId).to.be.null;
//     });
// });
