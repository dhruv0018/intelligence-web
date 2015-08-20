import Field from './Field';

/* Fetch angular from the browser scope */
const angular = window.angular;

/**
 * DropdownField Field Model
 * @class DropdownField
 */
class DropdownField extends Field {

    /**
     * @constructs DropdownField
     * @param {Object} field - Field JSON from server
     */
    constructor (field) {

        if (!field) return;
        super(field);

        let content = this.initializeValue(field.value, String);
        let value = {
            content,
            get name() {
                return content ? content : field.name;
            }
        };

        this.value = value;
    }


    get availableValues() {
        const options = JSON.parse(this.options);
        let availableValues = options.map(optionsToAvailableValues);

        function optionsToAvailableValues (option) {

            let value = {
                content: option,
                name: option
            };
            return value;
        }

        if (!this.isRequired) {
            availableValues.unshift({content: null, name: this.name});
        }

        return availableValues;
    }

    /**
     * Getter for the validity of the Field
     * @type {Boolean}
     */
    get valid () {

        return this.isRequired ?
            typeof this.value.content === 'string' :
            true;
    }

    /**
     * Reverts the class instance to JSON suitable for the server.
     *
     * @method toJSON
     * @returns {String} - JSON ready version of the object.
     */
    toJSON () {

        let variableValue = {

            type: null,
            value: this.value.content
        };

        return this.isVariableValueValid(variableValue) ? variableValue : 'Corrupted ' + this.type;
    }
}

export default DropdownField;
