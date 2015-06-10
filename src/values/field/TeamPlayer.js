import Value from '../value.js';

/* Fetch angular from the browser scope */
const angular = window.angular;

class TeamPlayerValue extends Value {
    constructor(value) {
        super();
        let injector = angular.element(document).injector();
        let players = injector.get('PlayersFactory');
        let player = players.get(value);
        this.name = player.firstName + ' ' + player.lastName;
        this.playerId = player.id;
    }
}

export default TeamPlayerValue;
