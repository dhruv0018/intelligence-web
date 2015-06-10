import Value from '../value.js';

/* Fetch angular from the browser scope */
const angular = window.angular;

class TeamPlayerValue extends Value {
    constructor(value, isPlayer) {
        super();
        let injector = angular.element(document).injector();

        //initialization
        this.name = undefined;
        this.teamId = undefined;
        this.playerId = undefined;
        this.isPlayer = undefined;

        if (!value) return;

        if (isPlayer) {
            let players = injector.get('PlayersFactory');
            let player = players.get(value);
            this.name = player.firstName + ' ' + player.lastName;
            this.playerId = player.id;
            this.isPlayer = isPlayer;
        } else {
            //todo add team stuff
            console.log('team stuff');
        }

    }
}

export default TeamPlayerValue;
