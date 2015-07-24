import Value from '../value';

/**
 * KrossoverField Field Model
 * @class KrossoverField
 */
class Field extends Value {

    /**
     * @constructs Field
     * @param {Object} field - Field JSON from server
     */
    constructor (field) {

        if (!field) return;

        super(field);
        this.extend(field);

        if (!field.value) {
            field.value = undefined;
            return;
        }

        if (field.value === null && !field.isRequired) {
            this.value = value;
            return;
        } else if (field.value === null && field.isRequired) {
            throw Error('Corrupted data - null value in required field');
        }
    }

    /**
     * Sets the value property by creating an 'available value'. If called from
     * the constructor, it uses default value if none are passed in.
     *
     * @method initialize
     * @param {object} [value] - the value to be set
     * @returns {undefined}
     */
    initialize (value = this.value) {

        this.currentValue = value;
    }

    /**
     * Getter/Setter for the value of the Field
     * @type {object}
     */
    get currentValue () {

        return this.value;
    }

    set currentValue (value) {

        this.value = value;
    }

    //validates data sent to the server
    isValid(variableValue) {
        let isValid = false;
        if (this.isRequired && variableValue.value !== undefined && variableValue.value !== null)
            isValid = true;
        else if (!this.isRequired && (variableValue.value || variableValue.value === null))
            isValid = true;
        //todo do something with the validation
        if (!isValid) {
            console.log('This field does not validate properly and cannot save to the server');
            console.log(this.inputType, variableValue);
        }
        return isValid;
    }

    /**
     * Method: toString
     * Generates an HTML string of the field.
     *
     * @return: {String} HTML of the field
     */
    toString () {

        // TODO: Removed this method or change to a sensible default.
        return `<h1>TEMPORARY!!!! toString method not defined for this field!</h1>`;
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
