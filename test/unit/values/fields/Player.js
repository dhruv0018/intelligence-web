// jshint ignore: start
import PlayerField from '../../../../src/values/field/Player.js';
import PlayerFieldData from '../sample-data/Player.js';

const assert  = chai.assert;
const expect  = chai.expect;
const should  = chai.should();

const tagVariable = PlayerFieldData.Tag;
const eventVariable = PlayerFieldData.Event;

beforeEach(angular.mock.module('intelligence-web-client'));


describe('General Player Field', () => {
    let tagField = new PlayerField(tagVariable);
    it('The Player Class should Exist', () => {
        expect(PlayerField).to.exist;
    });
});

/* TODO: This is not really necessary as we will not be instantiating Fields
 * from tag data alone. */
// describe('Player Tag Field', () => {
//     it('Should be initialized correctly if required', () => {
//         let localTagVariable = angular.copy(tagVariable);
//         localTagVariable.isRequired = true;
//         let tagField = new PlayerField(localTagVariable);
//         let value = tagField.currentValue;
//
//         expect(value.playerId).to.be.undefined;
//         expect(value.name).to.equal('');
//     });
//
//     it('Should be initialized correctly if not required', () => {
//         let localTagVariable = angular.copy(tagVariable);
//         localTagVariable.isRequired = false;
//         let tagField = new PlayerField(localTagVariable);
//         let value = tagField.currentValue;
//
//         expect(value.playerId).to.be.null;
//     });
//
// });

describe('Player Event Field', () => {

    it('Should have properly set value if required', () => {
        let localEventVariable = angular.copy(eventVariable);
        localEventVariable.isRequired = true;
        let eventField = new PlayerField(localEventVariable);
        let value = eventField.currentValue;

        expect(value.playerId).to.equal(1);
        //todo cant test this until we figure out how injection works in this case
        //expect(value.name).to.equal('something');
    });

    //it('Should set values properly', () => {
        //todo can't run these tests until we figure out how injection works

        // let localEventVariable = angular.copy(eventVariable);
        // localEventVariable.isRequired = true;
        // let eventField = new PlayerField(localEventVariable);
        // eventField.currentValue = eventField.availableValues[2];
        // let value = eventField.currentValue;
    //});

    it('toJSON should serialize to the right format if the field has a value', () => {
        let localEventVariable = angular.copy(eventVariable);
        localEventVariable.isRequired = true;
        let eventField = new PlayerField(localEventVariable);
        let value = eventField.currentValue;

        expect(JSON.stringify(eventField)).to.equal('{"type":"Player","value":1}');
    });

    it('toJSON should serialize to the right format if the field has no value', () => {
        let localEventVariable = angular.copy(eventVariable);
        localEventVariable.isRequired = false;
        localEventVariable.value = undefined;

        let eventField = new PlayerField(localEventVariable);
        let value = eventField.currentValue;

        expect(JSON.stringify(eventField)).to.equal('{"type":"Player","value":null}');
    });
    //
    // it('Should be able to switch back to an optional value from a set value', () => {
    //     let localEventVariable = angular.copy(eventVariable);
    //     localEventVariable.isRequired = false;
    //     let eventField = new PlayerField(localEventVariable);
    //     let value = eventField.currentValue;
    //     expect(value.playerId).to.not.be.null;
    //     eventField.currentValue = eventField.availableValues[0];
    //     value = eventField.currentValue;
    //     expect(value.playerId).to.be.null;
    // });

    it('Should be allow for initialization via the initialize method', () => {

        let localTagVariable = angular.copy(tagVariable);
        localTagVariable.isRequired = false;
        let tagField = new PlayerField(localTagVariable);

        tagField.initialize('1');
        let value = tagField.currentValue;

        expect(value.playerId).to.equal(1);
        expect(value.name).to.equal('');
    });
});
