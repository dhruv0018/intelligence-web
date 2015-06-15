import Field from './Field.js';

/* Fetch angular from the browser scope */
const angular = window.angular;

class TeamPlayerField extends Field {
    constructor(field) {

        if (!field) return;
        super(field);

        let injector = angular.element(document).injector();

        let value = {};

        //initialization
        value.name = undefined;
        value.teamId = undefined;
        value.playerId = undefined;

        if (field.value === null && !field.isRequired) {
            this.value = value;
            return;
        } else if (field.value === null && field.isRequired) {
            throw Error('Corrupted data - null value in required field');
        }

        //todo refine this a bit later
        if (field.type === 'Player') {
            let players = injector.get('PlayersFactory');
            let player = players.get(field.value);
            value.name = player.firstName + ' ' + player.lastName;
            value.playerId = player.id;
        } else if (field.type === 'Team') {
            let teams = injector.get('TeamsFactory');
            let team = teams.get(field.value);
            value.name = team.name;
            value.teamId = team.id;
        }

        this.value = value;

    }
}

export default TeamPlayerField;
