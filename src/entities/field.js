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

        return this.extend(field);
    }

    toJSON () {

        return this;
    }
}

/**
 * @module KrossoverField
 * @exports entities/field
 */
export default KrossoverField;
