import Field from './Field';
import Getters from './DynamicGetters';

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
                return Getters.teamName(field, teamId);
            }
        };
        this.value = value;
    }

    get availableValues () {
        return Getters.teamValues(this);
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
