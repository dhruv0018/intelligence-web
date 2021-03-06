import Field from './Field';
import Team from './common/Team';

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
        super(field);

        let teamId = this.initializeValue(field.value);
        let value = {
            teamId,
            get name () {
                return Team.getters.name(field, teamId);
            }
        };
        this.value = value;
    }

    get availableValues () {
        return Team.getters.availableValues(this);
    }

    /**
     * Getter for the validity of the Field
     * @type {Boolean}
     */
    get valid () {
        return this.isRequired ? Number.isInteger(this.value.teamId) : true;
    }

    /**
     * Reverts the class instance to JSON suitable for the server.
     *
     * @method toJSON
     * @returns {String} - JSON ready version of the object.
     */
    toJSON () {

        let variableValue = {};
        let teamId = this.value.teamId;
        variableValue = {
            type: 'Team',
            value: teamId
        };

        return this.isVariableValueValid(variableValue) ? variableValue : 'Corrupted ' + this.type;
    }
}

export default TeamField;
