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

        this.initialize();

        Object.defineProperty(this.value, 'name', {
            get: () => {
                let calculatedName = !this.isRequired ? 'Optional' : 'Select';
                let value = this.currentValue;
                let teamId = value.teamId;
                if (teamId) {
                    let injector = angular.element(document).injector();
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

        let teamOption = {

            teamId: (!this.isRequired && this.type === 'Team') ? null : undefined
        };

        if (value) {

            teamOption.teamId = value;
        }

        this.currentValue = teamOption;
    }

    get currentValue () {

        return this.value;
    }

    set currentValue (teamOption) {
        let value = {
            teamId: (teamOption.teamId) ? Number(teamOption.teamId) : teamOption.teamId,
            name: teamOption.name || ''
        };
        this.value = value;
    }

    /**
     * Generates an HTML string of the field.
     *
     * @method toString
     * @returns {String} HTML of the field
     */
    toString () {

        let team = this.availableValues.find(value => value.teamId === this.currentValue.teamId);

        return `<span class="value team-field">${team.name}</span>`;
    }

    /**
     * Reverts the class instance to JSON suitable for the server.
     *
     * @method toJSON
     * @returns {String} - JSON ready version of the object.
     */
    toJSON () {
        let variableValue = {};
        let value = (!this.isRequired && this.value.teamId === null) ? null : String(this.value.teamId);
        variableValue = {
            type: 'Team',
            value
        };

        return this.isValid(variableValue) ? variableValue : 'Corrupted ' + this.inputType;
    }
}

export default TeamField;
