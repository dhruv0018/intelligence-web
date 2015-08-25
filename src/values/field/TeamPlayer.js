import Field from './Field';
import Team from './common/Team';
import Player from './common/Player';

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
    constructor (field, type) {
        super(field);

        let id = this.initializeValue(field.value);

        let value = {
            get name() {
                if (!type) {
                    return field.name;
                }
                return type === 'Team' ? Team.getters.name(field, id) : Player.getters.name(field, id);
            },
            get type() {
                return type;
            },
            get jerseyColor(){
                return Player.getters.jerseyColor(field, id);
            },
            id
        };

        this.value = value;

    }

    get availableValues () {
        return Team.getters.availableValues(this).concat(Player.getters.availableValues(this));
    }

    /**
     * Generates an HTML string of the field.
     *
     * @method toString
     * @returns {String} - HTML of the field
     */
    toString () {
        return this.value.type === 'Player' ? Player.functionality.toString(this) : super.toString();
    }

    /**
     * Getter for the validity of the Field
     * @type {Boolean}
     */
    get valid () {
        let value = this.value.id;
        return this.isRequired ?
            Number.isInteger(value) :
            value === null ? true : false;
    }

    /**
     * Reverts the class instance to JSON suitable for the server.
     *
     * @method toJSON
     * @returns {String} - JSON ready version of the object.
     */
    toJSON () {
        let variableValue = {
            type: this.value.type,
            value: Number(this.value.id)
        };

        return this.isVariableValueValid(variableValue) ? variableValue : 'Corrupted ' + this.value.type;
    }
}

export default TeamPlayerField;
