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

describe('Player Dropdown Field', () => {
    let srcField;
    let playerField;
    let teamField;

    beforeEach(() => {
        srcField = angular.copy(rawField);
        playerField = new TeamPlayerField(srcField, 'Player');
        teamField = new TeamPlayerField(srcField, 'Team');
    });

    it('Should set values properly (always required)', () => {
        let playerValue = playerField.value;
        let teamValue = teamField.value;

        expect(playerValue.id).to.equal(1);
        expect(teamValue.id).to.equal(1);
    });

    it('toJSON should serialize to the right format if the field has a value', () => {
        let playerPayload = playerField.toJSON();
        let teamPayload = teamField.toJSON();
        expect(JSON.stringify(playerPayload)).to.equal('{"type":"Player","value":1}');
        expect(JSON.stringify(teamPayload)).to.equal('{"type":"Team","value":1}');
    });
});
