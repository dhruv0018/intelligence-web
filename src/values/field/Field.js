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
}

/**
 * @module Field
 * @exports values/field
 */
export default Field;
