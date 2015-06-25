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

        Object.defineProperty(this.value, 'name', {
            get: () => {
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
        });

        Object.defineProperty(this, 'availableValues', {
            get: () => {

                if (!this.gameId) return [];

                let injector = angular.element(document).injector();

                let games = injector.get('GamesFactory');
                let teams = injector.get('TeamsFactory');
                let players = injector.get('PlayersFactory');

                let game = games.get(this.gameId);
                let team = game.teamId ? teams.get(game.teamId) : null;
                let opposingTeam = game.opposingTeamId ? teams.get(game.opposingTeamId) : null;

                let teamPlayersValues = Object.keys(game.rosters[team.id].playerInfo).map( (playerId) => {
                    let rosterEntry = game.rosters[team.id].playerInfo[playerId];
                    let player = players.get(playerId);

                    let value = {
                        playerId: player.id,
                        jerseyColor: game.primaryJerseyColor,
                        jerseyNumber: rosterEntry.jerseyNumber,
                        name: player.firstName + ' ' + player.lastName
                    };
                    return value;
                });

                let opposingTeamPlayersValues = Object.keys(game.rosters[opposingTeam.id].playerInfo).map( (playerId) => {
                    let rosterEntry = game.rosters[opposingTeam.id].playerInfo[playerId];
                    let player = players.get(playerId);

                    let value = {
                        playerId: player.id,
                        jerseyColor: game.opposingPrimaryJerseyColor,
                        jerseyNumber: rosterEntry.jerseyNumber,
                        name: player.firstName + ' ' + player.lastName
                    };
                    return value;
                });
                return teamPlayersValues.concat(opposingTeamPlayersValues);
            }
        });
    }

    get currentValue() {
        return this.value;
    }

    set currentValue(playerOption) {
        let value = {
            playerId: (playerOption.playerId) ? Number(playerOption.playerId) : playerOption.playerId
        };
        this.value = value;
    }

    toJSON(){
        let variableValue = {};
        let value = (!this.isRequired && this.value.playerId === null) ? null : String(this.value.playerId);

        variableValue = {
            type: 'Player',
            value
        };

        return this.isValid(variableValue) ? JSON.stringify(variableValue) : 'Corrupted ' + this.inputType;
    }
}

//PlayerField.$inject = ['PlayersFactory'];
//var IntelligenceWebClient = angular.module('intelligence-web-client');
//IntelligenceWebClient.factory('PlayersField', () => PlayersField);
export default PlayerField;
