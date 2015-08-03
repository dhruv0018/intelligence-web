import Field from './Field';

/* Fetch angular from the browser scope */
const angular = window.angular;

/**
 * YardField Field Model
 * @class YardField
 */
class YardField extends Field {

    /**
     * @constructs YardField
     * @param {Object} field - Field JSON from server
     */
    constructor (field) {

        if (!field) return;

        super(field);
        let content = this.initializeValue(field.value, String);
        this.value = {
            content,
            name: content ? content : !this.isRequired ? 'Optional': this.name
        };
    }

    get availableValues() {
        let values = Array.from(new Array(99), (item, yardLength) => {
            return {content: yardLength + 1, name: String(yardLength + 1)};
        });
        if (!this.isRequired) {
            values.unshift({content: null, name: 'Optional'});
        }
        return values;
    }

    /**
     * Getter for the validity of the Field
     * @type {Boolean}
     */
    get valid () {

        return this.isRequired ?
            Number.isInteger(this.value.content) :
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
        let value         = (!this.isRequired && this.value.content === null) ? null : String(this.value.content);

        variableValue = {

            type: null,
            value
        };

        return this.isVariableValueValid(variableValue) ? variableValue : 'Corrupted ' + this.type;
    }
}

export default YardField;
