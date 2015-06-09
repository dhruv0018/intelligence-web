import Entity from './entity';

/**
 * KrossoverField Entity Model
 * @class KrossoverField
 */
class Field extends Entity {

    constructor (field) {

        switch (arguments.length) {

            case 0:

                throw new Error('Invoking Field.constructor without passing a JSON object');
        }

        super();

        this.extend(field);
        this.value = field.value;
        this.availableValues = []; //todo
    }

    toJSON () {

        return '';
    }
}

/**
 * @module Field
 * @exports entities/field
 */
export default Field;
