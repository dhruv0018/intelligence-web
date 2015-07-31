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
            name: content ? content : !this.isRequired ? 'Optional' : this.name
        };

        this.value = value;
    }


    get availableValues() {
        let availableValues = JSON.parse(this.options).map(content => {
            return {content, name: content};
        });
        if (!this.isRequired) {
            availableValues.unshift({content: null, name: 'Optional'});
        }
        return angular.copy(availableValues);
    }

    /**
     * Generates an HTML string of the field.
     *
     * @method toString
     * @returns {String} - HTML of the field
     */
    toString () {

        return `<span class="value dropdown-field">${this.currentValue.content}</span>`;
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
