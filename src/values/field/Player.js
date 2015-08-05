import Field from './Field';
import Getters from './DynamicGetters';

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
                return Getters.playerName(field, playerId);
            }
        };
        this.value = value;
    }

    get availableValues() {
        return Getters.playerValues(this);
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
