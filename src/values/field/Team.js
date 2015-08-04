import Field from './Field';

/* Fetch angular from the browser scope */
const angular = window.angular;

/**
 * TeamField Field Model
 * @class TeamField
 */
class TeamField extends Field {

    /**
     * @constructs TeamField
     * @param {Object} field - Field JSON from server
     */
    constructor (field) {

        if (!field) return;
        super(field);

        let teamId = this.initializeValue(field.value);
        let value = {
            teamId,
            get name () {
                let calculatedName = !field.isRequired ? 'Optional' : field.name;
                if (teamId && window && window.angular && document) {
                    let injector = angular.element(document).injector();
                    if (injector) {
                        let teams = injector.get('TeamsFactory');
                        let team = teams.get(teamId);
                        calculatedName = angular.copy(team.name);
                    }
                }
                return calculatedName;
            }
        };
        this.value = value;
    }

    get availableValues () {
            let values = [];
            let injector = angular.element(document).injector();
            if (injector) {
                let games = injector.get('GamesFactory');
                let teams = injector.get('TeamsFactory');

                let game = games.get(this.gameId);
                let team = game.teamId ? teams.get(game.teamId) : null;
                let opposingTeam = game.opposingTeamId ? teams.get(game.opposingTeamId) : null;

                let teamValues = [team, opposingTeam].map((localTeam) => {
                    return {
                        teamId: localTeam.id,
                        name: localTeam.name,
                        color: (localTeam.id === game.teamId) ? game.primaryJerseyColor : game.opposingPrimaryJerseyColor
                    };
                });
                values = teamValues;
            }

            if (!this.isRequired) {
                values.unshift({teamId: null, name: 'Optional', color: null});
            }
            return values;
        }

    /**
     * Getter for the validity of the Field
     * @type {Boolean}
     */
    get valid () {
        let value = this.value;
        return this.isRequired ?
            Number.isInteger(value.teamId) :
            true;
    }

    /**
     * Reverts the class instance to JSON suitable for the server.
     *
     * @method toJSON
     * @returns {String} - JSON ready version of the object.
     */
    toJSON () {

        let variableValue = {};
        let teamId = this.value.teamId ? this.value.teamId : null;
        variableValue = {
            type: 'Team',
            value: teamId
        };

        return this.isVariableValueValid(variableValue) ? variableValue : 'Corrupted ' + this.type;
    }
}

export default TeamField;
