import Field from './Field';

/* Fetch angular from the browser scope */
const angular = window.angular;

/**
 * TeamPlayerField Field Model
 * @class TeamPlayerField
 */
class TeamPlayerField extends Field {

    /**
     * @constructs TeamPlayerField
     * @param {Object} field - Field JSON from server
     */
    constructor (field, variableValueType) {

        if (!field) return;

        super(field);

        let id = field.value;

        if (id) {
            id = Number(id);
        } else if (!id && !this.isRequired) {
            id = null;
        }

        let value = {
            teamId  : !this.isRequired ? null : undefined,
            playerId: !this.isRequired ? null : undefined
        };

        switch (variableValueType) {
            case 'Player':
                let playerId  = id;
                value.playerId = playerId;
                value.teamId   = undefined;
                value.variableValueType    = 'Player';
                Object.defineProperty(value, 'name', {
                    get: () => {
                        let calculatedName = !this.isRequired ? 'Optional' : 'Select';
                        if (playerId && window && window.angular && document) {
                            let injector = angular.element(document).injector();
                            let players = injector.get('PlayersFactory');
                            let player = players.get(playerId);
                            calculatedName = player.firstName + ' ' + player.lastName;
                        }
                        return calculatedName;
                    }
                });
                break;
            case 'Team':
                let teamId = id;
                value.teamId = teamId;
                value.playerId = undefined;
                value.variableValueType = 'Team';
                Object.defineProperty(value, 'name', {
                    get: () => {
                        let calculatedName = !this.isRequired ? 'Optional' : 'Select';
                        if (teamId && window && window.angular && document) {
                            let injector = angular.element(document).injector();
                            let teams = injector.get('TeamsFactory');
                            let team = teams.get(teamId);
                            calculatedName = angular.copy(team.name);
                        }
                        return calculatedName;
                    }
                });
                break;
            default:
                //TODO had to initialize it to something, meh
                value.variableValueType = 'Team';
                value.name = !this.isRequired ? 'Optional' : this.name;
                break;
        }

        this.currentValue = value;

    }

    get availableValues () {
            if (!this.gameId) return [];

            let injector     = angular.element(document).injector();

            let games        = injector.get('GamesFactory');
            let teams        = injector.get('TeamsFactory');
            let players      = injector.get('PlayersFactory');

            let game         = games.get(this.gameId);
            let team         = game.teamId ? teams.get(game.teamId) : null;
            let opposingTeam = game.opposingTeamId ? teams.get(game.opposingTeamId) : null;

            let teamPlayersValues = Object.keys(game.rosters[team.id].playerInfo).map( (playerId) => {

                let rosterEntry  = game.rosters[team.id].playerInfo[playerId];
                let player       = players.get(playerId);
                let jerseyNumber = player.isUnknown ? 'U' : rosterEntry.jerseyNumber;

                let value = {

                    playerId   : player.id,
                    jerseyColor: game.primaryJerseyColor,
                    jerseyNumber,
                    name       : '(' + jerseyNumber + ')  ' + player.firstName + ' ' + player.lastName,
                    variableValueType       : 'Player'
                };

                return value;
            });

            let opposingTeamPlayersValues = Object.keys(game.rosters[opposingTeam.id].playerInfo).map( (playerId) => {

                let rosterEntry  = game.rosters[opposingTeam.id].playerInfo[playerId];
                let player       = players.get(playerId);
                let jerseyNumber = player.isUnknown ? 'U' : rosterEntry.jerseyNumber;

                let value = {

                    playerId   : player.id,
                    jerseyColor: game.opposingPrimaryJerseyColor,
                    jerseyNumber,
                    name       : '(' + jerseyNumber + ')  '  + player.firstName + ' ' + player.lastName,
                    variableValueType       : 'Player'
                };

                return value;
            });

            let teamValues = [team, opposingTeam].map((localTeam) => {

                return {

                    teamId: localTeam.id,
                    name  : localTeam.name,
                    color : (localTeam.id === game.teamId) ? game.primaryJerseyColor : game.opposingPrimaryJerseyColor,
                    variableValueType  : 'Team'
                };
            });

            let playerValues = teamPlayersValues.concat(opposingTeamPlayersValues);

            return teamValues.concat(playerValues);
    }


    /**
     * Generates an HTML string of the field.
     *
     * @method toString
     * @returns {String} - HTML of the field
     */
    toString () {
        if (this.currentValue.variableValueType === 'Team') {
            return `<span class="value">${this.currentValue.name}</span>`;
        } else {

            let player = this.availableValues.find(value => value.playerId === this.currentValue.playerId);

            return `
            <span class="value">

                <svg version="1.1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="16px" height="16px" viewbox="0 0 16 16">
                    <rect fill="${player.jerseyColor}" x="0" y="0" width="16px" height="16px" />
                </svg>

                <span class="player-name">${player.name}</span>

            </span>
            `;
        }
    }

    /**
     * Getter for the validity of the Field
     * @type {Boolean}
     */
    get valid () {

        if (!this.isRequired) {

            return true;
        }

        switch (this.currentValue.type) {

            case 'Player': return Number.isInteger(this.value.playerId);

            case 'Team': return Number.isInteger(this.value.teamId);

            default:
                // throw new Error('TeamPlayerField.type must be Player or Team');
                return true;
        }
    }

    /**
     * Reverts the class instance to JSON suitable for the server.
     *
     * @method toJSON
     * @returns {String} - JSON ready version of the object.
     */
    toJSON () {
        let value = this.currentValue;
        let variableValue = {

            type: this.currentValue.variableValueType
        };

        switch (variableValue.type) {

            case 'Player':
                variableValue.value = (!this.isRequired && this.value.playerId === null) ? null : Number(this.value.playerId);
                break;

            case 'Team':
                variableValue.value = (!this.isRequired && this.value.teamId === null) ? null : Number(this.value.teamId);
                break;
        }

        return this.isVariableValueValid(variableValue) ? variableValue : 'Corrupted ' + this.type;
    }
}

export default TeamPlayerField;
