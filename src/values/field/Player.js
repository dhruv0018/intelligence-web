import Field from './Field.js';

/* Fetch angular from the browser scope */
const angular = window.angular;

class PlayerField extends Field {
    constructor(players, field) {

        if (!field) return;
        super(field);

        let injector = angular.element(document).injector();
        this.players = players;
        //injector.get('PlayersFactory');

        //initialization
        let playerOption = {
            name: !field.isRequired ? 'Optional' : undefined,
            playerId: (!field.isRequired && field.type === 'Player') ? null : undefined
        };

        if (field.value) {
            let player = this.players.get(field.value);
            playerOption.name = player.firstName + ' ' + player.lastName;
            playerOption.playerId = player.id;
        }

        this.currentValue = playerOption;

        this.availableValues = []; //todo blocker
    }

    get currentValue() {
        return this.value;
    }

    set currentValue(playerOption) {
        let value = {};
        if (!playerOption.id) {
            value = playerOption;
            this.value = value;
            return;
        }
        let player = this.players.get(playerOption.playerId);
        value.name = player.firstName + ' ' + player.lastName;
        value.playerId = player.id;
        this.value = value;
    }

    toJSON(){
        let variableValue = {};
        //todo make a constant for type
        variableValue = {
            type: 'Player',
            value: this.value.playerId
        };
        return this.isValid(variableValue) ? JSON.stringify(variableValue) : 'Corrupted ' + this.inputType;
    }
}

PlayerField.$inject = ['PlayersFactory'];
var IntelligenceWebClient = angular.module('intelligence-web-client');
IntelligenceWebClient.factory('PlayersField', () => PlayersField);
export default PlayerField;
