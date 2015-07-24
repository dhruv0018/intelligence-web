import Field from './Field.js';

/* Fetch angular from the browser scope */
const angular = window.angular;

class DropdownField extends Field {
    constructor(field) {

        if (!field) return;
        super(field);
        this.availableValues = JSON.parse(field.options).map(content => {
            return {content, name: content};
        });
        let initialOption = {
            content: !field.isRequired ? null : undefined,
            name: !field.isRequired ? 'Optional' : 'Select'
        };
        this.availableValues.unshift(initialOption);

        this.initialize();
    }

    /**
     * Sets the value property by creating an 'available value'. If called from
     * the constructor, it uses default value if none are passed in.
     *
     * @method initialize
     * @param {string} [value] - the value to be set
     * @returns {undefined}
     */
    initialize (value = this.value) {

        let dropdownOption = angular.copy(this.availableValues[0]);

        if (value) {

            dropdownOption.content = value;
            dropdownOption.name = value;
        }

        this.currentValue = dropdownOption;
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
     * Reverts the class instance to JSON suitable for the server.
     *
     * @method toJSON
     * @returns {String} - JSON ready version of the object.
     */
    toJSON () {

        let variableValue = {};
        variableValue = {
            type: null,
            value: this.value.content
        };

        return this.isValid(variableValue) ? variableValue : 'Corrupted ' + this.inputType;
    }
}

export default DropdownField;
