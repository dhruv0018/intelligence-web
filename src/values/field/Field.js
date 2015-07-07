import Value from '../value.js';

/**
 * KrossoverField Field Model
 * @class KrossoverField
 */
class Field extends Value {

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

    toJSON() {
        throw Error('Trying to stringify abstract class - Field');
    }

    reset() {
        this.value = undefined;
    }
}

/**
 * @module Field
 * @exports values/field
 */
export default Field;
