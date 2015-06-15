import Field from './Field.js';

/* Fetch angular from the browser scope */
const angular = window.angular;

class PlayerField extends Field {
    constructor(field) {

        if (!field) return;
        super(field);

        let injector = angular.element(document).injector();
        let players = injector.get('PlayersFactory');

        let value = {};

        if (field.value) {
            let player = players.get(field.value);
            value.name = player.firstName + ' ' + player.lastName;
            value.playerId = player.id;

            this.value = value;
        }

    }
}

export default PlayerField;
