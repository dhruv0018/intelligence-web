import Field from './Field.js';

/* Fetch angular from the browser scope */
const angular = window.angular;

class PlayerField extends Field {
    //constructor(players, field) {
    constructor(field) {

        if (!field) return;
        super(field);

        //initialization
        let playerOption = {
            playerId: (!field.isRequired && field.type === 'Player') ? null : undefined
        };
        if (field.value) playerOption.playerId = field.value;
        this.currentValue = playerOption;

        this.availableValues = []; //todo blocker
    }

    get name() {
        let calculatedName = !this.isRequired ? 'Optional' : 'Select';
        let value = this.currentValue;
        let playerId = value.playerId;
        if (playerId) {
            let injector = angular.element(document).injector();
            let players = injector.get('PlayersFactory');
            let player = players.get(playerId);
            calculatedName = player.firstName + ' ' + player.lastName;
        }
        return calculatedName;
    }

    set name (calculatedName) {
        // let calculatedName = !this.isRequired ? 'Optional' : 'Select';
        // let injector = angular.element(document).injector();
        // let players = injector.get('PlayersFactory');
        // let player = players.get(playerId);
        // calculatedName = player.firstName + ' ' + player.lastName;
        //this.value.name = calculatedName;
    }

    get currentValue() {
        return this.value;
    }

    set currentValue(playerOption) {
        let value = {
            playerId: playerOption.playerId
        };
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

//PlayerField.$inject = ['PlayersFactory'];
//var IntelligenceWebClient = angular.module('intelligence-web-client');
//IntelligenceWebClient.factory('PlayersField', () => PlayersField);
export default PlayerField;
