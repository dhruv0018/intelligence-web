import Field from './Field';

/* Fetch angular from the browser scope */
const angular = window.angular;

/**
 * PlayerField Field Model
 * @class PlayerField
 */
class PlayerField extends Field {

    /**
     * @constructs PlayerField
     * @param {Object} field - Field JSON from server
     */
    constructor (field) {

        if (!field) return;
        super(field);

        this.initialize();

        Object.defineProperty(this.value, 'name', {
            get: () => {
                let calculatedName = '';
                //!this.isRequired ? 'Optional' : 'Select';
                let value = this.currentValue;
                let playerId = value.playerId;
                //console.log('the playerId is ', playerId);
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
                    let jerseyNumber = player.isUnknown ? 'U' : angular.copy(rosterEntry.jerseyNumber);

                    let value = {
                        playerId: angular.copy(player.id),
                        jerseyColor: angular.copy(game.primaryJerseyColor),
                        jerseyNumber,
                        name: '(' + jerseyNumber + ')  ' + angular.copy(player.firstName) + ' ' + angular.copy(player.lastName)
                    };
                    return value;
                });

                let opposingTeamPlayersValues = Object.keys(game.rosters[opposingTeam.id].playerInfo).map( (playerId) => {
                    let rosterEntry = game.rosters[opposingTeam.id].playerInfo[playerId];
                    let player = players.get(playerId);
                    let jerseyNumber = player.isUnknown ? 'U' : angular.copy(rosterEntry.jerseyNumber);
                    let value = {
                        playerId: angular.copy(player.id),
                        jerseyColor: angular.copy(game.opposingPrimaryJerseyColor),
                        jerseyNumber,
                        name: '(' + jerseyNumber + ')  ' + angular.copy(player.firstName) + ' ' + angular.copy(player.lastName)
                    };
                    return value;
                });
                let values =  teamPlayersValues.concat(opposingTeamPlayersValues);

                if (!this.isRequired) {
                    values.push({playerId: null, jerseyColor: null, jerseyNumber: 'NONE', name: 'Optional'});
                }

                return values;
            }
        });
    }

    /**
     * Sets the value property by creating an 'available value'. If called from
     * the constructor, it uses default value if none are passed in.
     *
     * @method initialize
     * @param {integer} [value] - the value to be set
     * @returns {undefined}
     */
    initialize (value = this.value) {

        let playerOption = {

            playerId: (!this.isRequired && this.type === 'Player') ? null : undefined
        };

        if (value) {

            playerOption.playerId = value;
        }

        this.currentValue = playerOption;
    }

    get currentValue () {

        return this.value;
    }

    set currentValue(playerOption) {
        let value = {
            playerId: (playerOption.playerId) ? Number(playerOption.playerId) : playerOption.playerId,
            name: playerOption.name || ''
        };
        this.value = value;
        //console.log(this.value);
        //Object.assign(this.value, value);
    }

    get valid () {

        return this.isRequired ?
            Number.isInteger(this.value.playerId) :
            true;
    }

    /**
     * Generates an HTML string of the field.
     *
     * @method toString
     * @returns {String} - HTML of the field
     */
    toString () {

        let player = this.availableValues.find(value => value.playerId === this.currentValue.playerId);

        if (!player) {

            player = {

                name: 'Optional',
                jerseyColor: '#000000',
                jerseyNumber: ''
            };
        }

        return `
        <span class="value">

            <svg version="1.1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="16px" height="16px" viewbox="0 0 16 16">
                <rect fill="${player.jerseyColor}" stroke="black" stroke-width="${player.jerseyColor === '#ffffff' ? 1 : 0}" x="0" y="0" width="16px" height="16px" />
            </svg>

            <span class="player-name">${player.name}</span>

        </span>
        `;
    }

    /**
     * Reverts the class instance to JSON suitable for the server.
     *
     * @method toJSON
     * @returns {String} - JSON ready version of the object.
     */
    toJSON () {

        let variableValue = {};
        let value = (!this.isRequired && this.value.playerId === null) ? null : Number(this.value.playerId);

        variableValue = {
            type: 'Player',
            value
        };

        return this.isValid(variableValue) ? variableValue : 'Corrupted ' + this.type;
    }
}

//PlayerField.$inject = ['PlayersFactory'];
//var IntelligenceWebClient = angular.module('intelligence-web-client');
//IntelligenceWebClient.factory('PlayersField', () => PlayersField);
export default PlayerField;
