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

        let teamId = field.value;
        if (!teamId && !this.isRequired) teamId = null;

        let value = {
            teamId,
            get name () {
                let calculatedName = !this.isRequired ? 'Optional' : 'Select';
                if (teamId) {
                    let injector = angular.element(document).injector();
                    let teams = injector.get('TeamsFactory');
                    let team = teams.get(teamId);
                    calculatedName = angular.copy(team.name);
                }
                return calculatedName;
            }
        };
        this._value = value;
    }

    get currentValue () {

        return this._value;
    }

    set currentValue (teamOption) {
        this._value = teamOption;
    }

    get availableValues () {
            if (!this.gameId) return [];

            let injector = angular.element(document).injector();

            let games = injector.get('GamesFactory');
            let teams = injector.get('TeamsFactory');

            let game = games.get(this.gameId);
            let team = game.teamId ? teams.get(game.teamId) : null;
            let opposingTeam = game.opposingTeamId ? teams.get(game.opposingTeamId) : null;
            let values = [team, opposingTeam].map((localTeam) => {
                return {
                    teamId: localTeam.id,
                    name: localTeam.name,
                    color: (localTeam.id === game.teamId) ? game.primaryJerseyColor : game.opposingPrimaryJerseyColor
                };
            });

            if (!this.isRequired) {
                values.push({teamId: null, name: 'Optional', color: null});
            }
            return values;
        }
    /**
     * Generates an HTML string of the field.
     *
     * @method toString
     * @returns {String} HTML of the field
     */
    toString () {
        return `<span class="value team-field">${this.currentValue.name}</span>`;
    }

    /**
     * Getter for the validity of the Field
     * @type {Boolean}
     */
    get valid () {
        let value = this.currentValue;
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
        let value         = (!this.isRequired && this._value.teamId === null) ? null : Number(this._value.teamId);

        variableValue = {

            type: 'Team',
            value
        };

        return this.isVariableValueValid(variableValue) ? variableValue : 'Corrupted ' + this.type;
    }
}

export default TeamField;
