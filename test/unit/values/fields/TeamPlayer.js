// jshint ignore: start
import TeamPlayerField from '../../../../src/values/field/TeamPlayer.js';
import TeamPlayerFieldData from '../sample-data/TeamPlayer.js';

const assert  = chai.assert;
const expect  = chai.expect;
const should  = chai.should();

const playerTagVariable = TeamPlayerFieldData.Player.Tag;
const playerEventVariable = TeamPlayerFieldData.Player.Event;
const teamTagVariable = TeamPlayerFieldData.Team.Tag;
const teamEventVariable = TeamPlayerFieldData.Team.Event;

beforeEach(angular.mock.module('intelligence-web-client'));


describe('General TeamPlayer Field', () => {
    let playerTagField = new TeamPlayerField(playerTagVariable);
    let teamTagField = new TeamPlayerField(teamTagVariable);

    it('The TeamPlayer Class should Exist', () => {
        expect(TeamPlayerField).to.exist;
    });

    it('Should have correct input type', () => {
        expect(playerTagField.inputType).to.exist;
        expect(playerTagField.inputType).to.equal('PLAYER_TEAM_DROPDOWN');
        expect(teamTagField.inputType).to.exist;
        expect(teamTagField.inputType).to.equal('PLAYER_TEAM_DROPDOWN');
    });

});

describe('TeamPlayer Tag Field', () => {
    it('Should be initialized correctly if required', () => {
        let localPlayerTagVariable = angular.copy(playerTagVariable);
        let localTeamTagVariable = angular.copy(teamTagVariable);

        localPlayerTagVariable.isRequired = true;
        localTeamTagVariable.isRequired = true;

        let playerTagField = new TeamPlayerField(localPlayerTagVariable);
        let teamTagField = new TeamPlayerField(localTeamTagVariable);

        let playerValue = playerTagField.currentValue;
        let teamValue = teamTagField.currentValue;

        expect(playerValue.playerId).to.be.undefined;
        expect(teamValue.teamId).to.be.undefined;
    });

    it('Should be initialized correctly if not required', () => {
        let localPlayerTagVariable = angular.copy(playerTagVariable);
        let localTeamTagVariable = angular.copy(teamTagVariable);

        localPlayerTagVariable.isRequired = false;
        localTeamTagVariable.isRequired = false;

        let playerTagField = new TeamPlayerField(localPlayerTagVariable);
        let teamTagField = new TeamPlayerField(localTeamTagVariable);

        let playerValue = playerTagField.currentValue;
        let teamValue = teamTagField.currentValue;

        expect(playerValue.playerId).to.be.null;
        expect(teamValue.teamId).to.be.null;
    });

});

describe('TeamPlayer Event Field', () => {

    it('Should have properly set value if required', () => {
        let localPlayerTagVariable = angular.copy(playerEventVariable);
        let localTeamTagVariable = angular.copy(teamEventVariable);

        localPlayerTagVariable.isRequired = true;
        localTeamTagVariable.isRequired = true;

        let playerTagField = new TeamPlayerField(localPlayerTagVariable);
        let teamTagField = new TeamPlayerField(localTeamTagVariable);

        let playerValue = playerTagField.currentValue;
        let teamValue = teamTagField.currentValue;

        expect(playerValue.playerId).to.equal(1);
        expect(teamValue.teamId).to.equal(1);
    });

    //it('Should set values properly', () => {
        //todo can't run these tests until we figure out how injection works

        // let localEventVariable = angular.copy(eventVariable);
        // localEventVariable.isRequired = true;
        // let eventField = new TeamPlayerField(localEventVariable);
        // eventField.currentValue = eventField.availableValues[2];
        // let value = eventField.currentValue;
    //});

    it('toJSON should serialize to the right format if the field has a value', () => {
        let localPlayerTagVariable = angular.copy(playerEventVariable);
        let localTeamTagVariable = angular.copy(teamEventVariable);

        localPlayerTagVariable.isRequired = true;
        localTeamTagVariable.isRequired = true;

        let playerEventField = new TeamPlayerField(localPlayerTagVariable);
        let teamEventField = new TeamPlayerField(localTeamTagVariable);

        let serializedPlayerField = playerEventField.toJSON();
        let serializedTeamField = teamEventField.toJSON();

        expect(serializedPlayerField).to.equal('{"type":"Player","value":"1"}');
        expect(serializedTeamField).to.equal('{"type":"Team","value":"1"}');
    });

    it('toJSON should serialize to the right format if the field has no value', () => {
        let localPlayerTagVariable = angular.copy(playerEventVariable);
        let localTeamTagVariable = angular.copy(teamEventVariable);

        localPlayerTagVariable.isRequired = false;
        localPlayerTagVariable.value = undefined;
        localTeamTagVariable.isRequired = false;
        localTeamTagVariable.value = undefined;

        let playerTagField = new TeamPlayerField(localPlayerTagVariable);
        let teamTagField = new TeamPlayerField(localTeamTagVariable);

        let serializedPlayerField = playerTagField.toJSON();
        let serializedTeamField = teamTagField.toJSON();

        expect(serializedPlayerField).to.equal('{"type":"Player","value":null}');
        expect(serializedTeamField).to.equal('{"type":"Team","value":null}');
    });
    //
    // it('Should be able to switch back to an optional value from a set value', () => {
    //     let localEventVariable = angular.copy(eventVariable);
    //     localEventVariable.isRequired = false;
    //     let eventField = new TeamPlayerField(localEventVariable);
    //     let value = eventField.currentValue;
    //     expect(value.TeamPlayerId).to.not.be.null;
    //     eventField.currentValue = eventField.availableValues[0];
    //     value = eventField.currentValue;
    //     expect(value.TeamPlayerId).to.be.null;
    // });
});
