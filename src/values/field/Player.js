import Field from './Field';
import Player from './common/Player';

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
        super(field);

        let playerId = this.initializeValue(field.value);
        let value = new Player.value(field, playerId);
        this.value = value;
    }

    get availableValues() {
        return Player.getters.availableValues(this);
    }

    /**
     * Getter for the validity of the Field
     * @type {Boolean}
     */
    get valid () {
        let value = this.value.playerId;
        let isValid = this.isRequired ? Number.isInteger(value) : value !== undefined ? true : false;
        return isValid;
    }

    /**
     * Generates an HTML string of the field.
     *
     * @method toString
     * @returns {String} - HTML of the field
     */
    toString () {
        return Player.functionality.toString(this);
    }

    /**
     * Reverts the class instance to JSON suitable for the server.
     *
     * @method toJSON
     * @returns {String} - JSON ready version of the object.
     */
    toJSON () {

        let variableValue = {};
        let value = this.value.playerId;

        variableValue = {

            type: 'Player',
            value
        };

        return this.isVariableValueValid(variableValue) ? variableValue : 'Corrupted ' + this.type;
    }
}

export default PlayerField;
