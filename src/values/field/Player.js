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

        let playerId = this.initializeValue(field.value);
        let value = {
            playerId,
            get name () {
                let calculatedName = !field.isRequired ? 'Optional' : field.name;
                if (playerId) {
                    let injector = angular.element(document).injector();
                    let players = injector.get('PlayersFactory');
                    let player = players.get(playerId);
                    calculatedName = player.firstName + ' ' + player.lastName;
                }
                return calculatedName;
            }
        };
        this.value = value;
    }

    get availableValues() {
        let injector = angular.element(document).injector();
        let values = [];

        if (window && injector && document && window.angular) {
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
            values =  teamPlayersValues.concat(opposingTeamPlayersValues);
        }

        if (!this.isRequired) {
            values.unshift({playerId: null, jerseyColor: null, jerseyNumber: 'NONE', name: 'Optional'});
        }

        return values;
    }

    /**
     * Getter for the validity of the Field
     * @type {Boolean}
     */
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
        let value = this.value;

        return `
        <span class="value">

            <svg version="1.1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="16px" height="16px" viewbox="0 0 16 16">
                <rect fill="${value.jerseyColor}" stroke="black" stroke-width="${value.jerseyColor === '#ffffff' ? 1 : 0}" x="0" y="0" width="16px" height="16px" />
            </svg>

            <span class="player-name">${value.name}</span>

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
        let value         = (!this.isRequired && this.value.playerId === null) ? null : Number(this.value.playerId);

        variableValue = {

            type: 'Player',
            value
        };

        return this.isVariableValueValid(variableValue) ? variableValue : 'Corrupted ' + this.type;
    }
}

export default PlayerField;
