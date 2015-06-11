import Value from '../value.js';

/* Fetch angular from the browser scope */
const angular = window.angular;

class TeamPlayerValue extends Value {
    constructor(value, isPlayer = undefined) {
        super();
        let injector = angular.element(document).injector();

        //initialization
        this.name = undefined;
        this.teamId = undefined;
        this.playerId = undefined;
        this.isPlayer = isPlayer;

        //todo we might want to have some sort of handling here specially for undef versus null
        if (!value) return;

        if (isPlayer) {
            let players = injector.get('PlayersFactory');
            let player = players.get(value);
            this.name = player.firstName + ' ' + player.lastName;
            this.playerId = player.id;
        } else {
            //todo add team stuff
            let teams = injector.get('TeamsFactory');
            let team = teams.get(value);
            this.name = team.name;
            this.teamId = team.id;
        }

    }
}

export default TeamPlayerValue;
