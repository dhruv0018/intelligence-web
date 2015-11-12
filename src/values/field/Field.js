import Value from '../value';

/**
 * Field Field Model
 * @class Field
 */
class Field extends Value {

    /**
     * @constructs Field
     * @param {Object} field - Field JSON from server
     */
    constructor (field) {

        if (!field) {
            throw new Error('You need to pass in a field');
        }

        super(field);

        if (field.value === null && field.isRequired)
            console.error('Corrupted data - null value in required field');
    }

    initializeValue(value, typeCast = Number) {
        let fieldValue = value;
        if (fieldValue) {
            fieldValue = typeCast(fieldValue);
        } else if (!this.isRequired) {
            fieldValue = null;
        }
        return fieldValue;
    }

    /**
     * Getter/Setter for the value of the Field
     * @type {object}
     */
    get value () {

        return this._value;
    }

    set value (value) {

        this._value = value;
    }

    /**
     * Getter for placeholder text which displays the tag name when there is no value, but otherwise shows field value name
     * type {String}
     */
    get placeholder() {
        return this.value.name ? this.value.name : this.name;
    }

    /**
     * Checks the validity of the variableValue (returned by toJSON)
     *
     * @method isVariableValueValid
     * @param {object} variableValue - the value to check
     * @returns {Boolean}
     */
    isVariableValueValid (variableValue) {
        let isValid = false;

        if (
            this.isRequired &&
            variableValue.value !== undefined &&
            variableValue.value !== null
        ) {

            isValid = true;
        } else if (
            !this.isRequired && variableValue.value !== undefined
        ) {

            isValid = true;
        }

        // TODO: do something with the validation
        if (!isValid) {

            console.error('This field does not validate properly and cannot save to the server');
            console.error(this.type, variableValue);
            console.error('Is this field required? : ' + this.isRequired);
        }

        return isValid;
    }

    /**
     * Generates an HTML string of the field.
     *
     * @method toString
     * @returns {String} HTML of the field
     */
    toString () {

        return `<span class="value">${this.value.name}</span>`;
    }

    /**
     * Reverts the class instance to JSON suitable for the server.
     *
     * @method toJSON
     * @returns {String} - JSON ready version of the object.
     */
    toJSON () {

        throw Error('Trying to stringify abstract class - Field');
    }
}

/**
 * @module Field
 * @exports values/field
 */
export default Field;
