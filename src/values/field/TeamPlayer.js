import Field from './Field';
import Getters from './DynamicGetters';

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

        let id = this.initializeValue(field.value);

        let value = {
            get name() {
                if (!variableValueType) {
                    return field.name;
                }
                return variableValueType === 'Team' ? Getters.teamName(field, id) : Getters.playerName(field, id);
            }
        };

        switch (variableValueType) {
            case 'Player':
                value.playerId = id;
                value.teamId = undefined;
                value.variableValueType = 'Player';
                break;
            case 'Team':
                value.teamId = id;
                value.playerId = undefined;
                value.variableValueType = 'Team';
                break;
        }

        this.value = value;

    }

    get availableValues () {
        return Getters.teamPlayerValues(this);
    }


    /**
     * Generates an HTML string of the field.
     *
     * @method toString
     * @returns {String} - HTML of the field
     */
    toString () {
        if (this.value.variableValueType === 'Player') {
            return `
            <span class="value">

                <svg version="1.1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="16px" height="16px" viewbox="0 0 16 16">
                    <rect fill="${this.value.jerseyColor}" x="0" y="0" width="16px" height="16px" />
                </svg>

                <span class="player-name">${this.value.name}</span>

            </span>
            `;
        }
        return super.toString();
    }

    /**
     * Getter for the validity of the Field
     * @type {Boolean}
     */
    get valid () {

        switch (this.value.variableValueType) {

            case 'Player': return Number.isInteger(this.value.playerId);

            case 'Team': return Number.isInteger(this.value.teamId);

            default:
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
            type: this.value.variableValueType
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
