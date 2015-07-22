// jshint ignore: start
import TeamField from '../../../../src/values/field/Team.js';
import TeamFieldData from '../sample-data/Team.js';

const assert  = chai.assert;
const expect  = chai.expect;
const should  = chai.should();

const tagVariable = TeamFieldData.Tag;
const eventVariable = TeamFieldData.Event;

beforeEach(angular.mock.module('intelligence-web-client'));


describe('General Team Field', () => {
    let tagField = new TeamField(tagVariable);
    it('The Team Class should Exist', () => {
        expect(TeamField).to.exist;
    });

    it('Should have correct input type', () => {
        expect(tagField.inputType).to.exist;
        expect(tagField.inputType).to.equal('TEAM_DROPDOWN');
    });

});

describe('Team Tag Field', () => {
    it('Should be initialized correctly if required', () => {
        let localTagVariable = angular.copy(tagVariable);
        localTagVariable.isRequired = true;
        let tagField = new TeamField(localTagVariable);
        let value = tagField.currentValue;

        expect(value.teamId).to.be.undefined;
        //expect(value.name).to.equal('Select');
    });

    it('Should be initialized correctly if not required', () => {
        let localTagVariable = angular.copy(tagVariable);
        localTagVariable.isRequired = false;
        let tagField = new TeamField(localTagVariable);
        let value = tagField.currentValue;

        expect(value.teamId).to.be.null;
    });

});

describe('Team Event Field', () => {

    it('Should have properly set value if required', () => {
        let localEventVariable = angular.copy(eventVariable);
        localEventVariable.isRequired = true;
        let eventField = new TeamField(localEventVariable);
        let value = eventField.currentValue;

        expect(value.teamId).to.equal(1);
        //todo cant test this until we figure out how injection works in this case
        //expect(value.name).to.equal('something');
    });

    //it('Should set values properly', () => {
        //todo can't run these tests until we figure out how injection works

        // let localEventVariable = angular.copy(eventVariable);
        // localEventVariable.isRequired = true;
        // let eventField = new TeamField(localEventVariable);
        // eventField.currentValue = eventField.availableValues[2];
        // let value = eventField.currentValue;
    //});

    it('toJSON should serialize to the right format if the field has a value', () => {
        let localEventVariable = angular.copy(eventVariable);
        localEventVariable.isRequired = true;
        let eventField = new TeamField(localEventVariable);
        let value = eventField.currentValue;

        expect(JSON.stringify(eventField)).to.equal('{"type":"Team","value":"1"}');
    });

    it('toJSON should serialize to the right format if the field has no value', () => {
        let localEventVariable = angular.copy(eventVariable);
        localEventVariable.isRequired = false;
        localEventVariable.value = undefined;

        let eventField = new TeamField(localEventVariable);
        let value = eventField.currentValue;

        expect(JSON.stringify(eventField)).to.equal('{"type":"Team","value":null}');
    });
    //
    // it('Should be able to switch back to an optional value from a set value', () => {
    //     let localEventVariable = angular.copy(eventVariable);
    //     localEventVariable.isRequired = false;
    //     let eventField = new TeamField(localEventVariable);
    //     let value = eventField.currentValue;
    //     expect(value.TeamId).to.not.be.null;
    //     eventField.currentValue = eventField.availableValues[0];
    //     value = eventField.currentValue;
    //     expect(value.TeamId).to.be.null;
    // });
});
