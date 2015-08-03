// jshint ignore: start
import TeamPlayerField from '../../../../src/values/field/TeamPlayer.js';
import TeamPlayerFieldData from '../sample-data/TeamPlayer.js';

const assert  = chai.assert;
const expect  = chai.expect;
const should  = chai.should();

const rawField = TeamPlayerFieldData;

describe('General TeamPlayer Field', () => {
    it('The TeamPlayer Class should Exist', () => {
        expect(TeamPlayerField).to.exist;
    });
});

describe.only('Player Dropdown Field', () => {
    let srcPlayerField;
    let srcTeamField;
    let playerField;
    let teamField;

    beforeEach(() => {
        srcPlayerField = angular.copy(rawField.player);
        srcTeamField = angular.copy(rawField.team);
        playerField = new TeamPlayerField(srcPlayerField, 'Player');
        teamField = new TeamPlayerField(srcTeamField, 'Team');
    });

    it('Should set values properly (always required)', () => {
        let playerValue = playerField.value;
        let teamValue = teamField.value;

        expect(playerValue.playerId).to.equal(1);
    });

    it('toJSON should serialize to the right format if the field has a value', () => {
        let playerPayload = playerField.toJSON();
        let teamPayload = teamField.toJSON();
        expect(JSON.stringify(playerPayload)).to.equal('{"type":"Player","value":1}');
        expect(JSON.stringify(teamPayload)).to.equal('{"type":"Team","value":1}');
    });

    // it('Should validate correctly', () => {
    //     let field = unrequiredField;
    //     field.availableValues.forEach(value => {
    //         field.value = value;
    //         expect(field.valid).to.be.true;
    //     });
    // });
});
