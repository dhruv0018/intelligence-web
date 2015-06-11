import Value from '../value.js';

/**
 * KrossoverField Entity Model
 * @class KrossoverField
 */
class Field extends Value {

    constructor (field) {
        if (!field) return;

        super(field);
        this.extend(field);
    }
}

/**
 * @module Field
 * @exports values/field
 */
export default Field;
