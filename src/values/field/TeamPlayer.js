import Field from './field.js';

/* Fetch angular from the browser scope */
const angular = window.angular;

class TeamPlayerField extends Field {
    constructor(field, isPlayer = false) {

        if (!field) return;
        super(field);

        let injector = angular.element(document).injector();

        let value = {};

        //initialization
        value.name = undefined;
        value.teamId = undefined;
        value.playerId = undefined;
        value.isPlayer = isPlayer;

        //todo we might want to have some sort of handling here specially for undef versus null
        if (isPlayer) {
            let players = injector.get('PlayersFactory');
            let player = players.get(field.value);
            value.name = player.firstName + ' ' + player.lastName;
            value.playerId = player.id;
        } else {
            let teams = injector.get('TeamsFactory');
            let team = teams.get(field.value);
            value.name = team.name;
            value.teamId = team.id;
        }

        this.value = value;

    }
}

export default TeamPlayerField;
