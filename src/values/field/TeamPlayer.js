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
    constructor (field) {

        if (!field) return;

        super(field);

        this.initialize();

        Object.defineProperty(this.value, 'name', {
            get: () => {
                let calculatedName = !this.isRequired ? 'Optional' : 'Select';
                let value = this.currentValue;
                let playerId = value.playerId;
                let teamId = value.teamId;
                let injector = angular.element(document).injector();

                if (playerId) {
                    let players = injector.get('PlayersFactory');
                    let player = players.get(playerId);
                    calculatedName = player.firstName + ' ' + player.lastName;
                }

                if (teamId) {
                    let teams = injector.get('TeamsFactory');
                    let team = teams.get(teamId);
                    calculatedName = angular.copy(team.name);
                }
                return calculatedName;
            }
        });

        Object.defineProperty(this, 'availableValues', {

            get: () => {

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
                        name       : jerseyNumber + ' - ' + player.firstName + ' ' + player.lastName,
                        type       : 'Player'
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
                        name       : jerseyNumber + ' - ' + player.firstName + ' ' + player.lastName,
                        type       : 'Player'
                    };

                    return value;
                });

                let teamValues = [team, opposingTeam].map((localTeam) => {

                    return {

                        teamId: localTeam.id,
                        name  : localTeam.name,
                        color : (localTeam.id === game.teamId) ? game.primaryJerseyColor : game.opposingPrimaryJerseyColor,
                        type  : 'Team'
                    };
                });

                let playerValues = teamPlayersValues.concat(opposingTeamPlayersValues);

                return teamValues.concat(playerValues);
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
    initialize (value = this.value, type = this.type) {

        /* TODO: Talk to Jason; set default type to 'Team'. */
        let teamPlayerOption = {

            teamId  : (!this.isRequired && type === 'Team') ? null   : undefined,
            playerId: (!this.isRequired && type === 'Player') ? null : undefined,
            name    : !this.isRequired ? 'Optional' : this.name,
            type    : 'Team'
        };

        if (value) {

            switch (type) {

            case 'Player':

                let playerId              = Number(value) ? Number(value) : null;
                teamPlayerOption.playerId = playerId;
                teamPlayerOption.teamId   = undefined;
                teamPlayerOption.type     = 'Player';

                break;

            case 'Team':

                let teamId                = Number(value) ? Number(value) : null;
                teamPlayerOption.teamId   = teamId;
                teamPlayerOption.playerId = undefined;
                teamPlayerOption.type     = 'Team';

                break;
            }
        }

        this.currentValue = teamPlayerOption;
    }

    /**
     * Getter/Setter for the value of the Field
     * @type {object}
     */
    get currentValue () {

        return this.value;
    }

    set currentValue (teamPlayerOption) {

        let value = {

            playerId: teamPlayerOption.playerId,
            teamId  : teamPlayerOption.teamId,
            name    : teamPlayerOption.name,
            type    : teamPlayerOption.type
        };

        this.value = value;
    }

    /**
     * Generates an HTML string of the field.
     *
     * @method toString
     * @returns {String} - HTML of the field
     */
    toString () {

        if (this.currentValue.type === 'Team') {

            return `<span class="value">${this.currentValue.name}</span>`;
        } else {

            let player = this.availableValues.find(value => value.playerId === this.currentValue.playerId);

            return `
            <span class="value">

                <svg version="1.1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="16px" height="16px" viewbox="0 0 16 16">
                    <rect fill="${player.jerseyColor}" x="0" y="0" width="16px" height="16px" />
                </svg>

                <span class="player-name">${player.jerseyNumber} ${player.name}</span>

            </span>
            `;
        }
    }

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

        let variableValue = {

            type: this.currentValue.type
        };

        switch (variableValue.type) {

            case 'Player':
                variableValue.value = (!this.isRequired && this.value.playerId === null) ? null : Number(this.value.playerId);
                break;

            case 'Team':
                variableValue.value = (!this.isRequired && this.value.teamId === null) ? null : Number(this.value.teamId);
                break;
        }

        return this.isValid(variableValue) ? variableValue : 'Corrupted ' + this.type;
    }
}

export default TeamPlayerField;
