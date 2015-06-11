import Value from '../value.js';

/**
 * KrossoverField Entity Model
 * @class KrossoverField
 */
class Field extends Value {

    constructor (field) {

        switch (arguments.length) {

            case 0:

                throw new Error('Invoking Field.constructor without passing a JSON object');
        }

        super();

        this.extend(field);
        //this.value = this.valueFactory();
        //this.availableValues = []; //todo
    }

    //valueFactory () {
    //    let value = {};
    //    //todo might to be refactored a bit once the entity class is defined
    //    switch(this.inputType) {
    //        case 'PLAYER_TEAM_DROPDOWN':
    //            if (this.type === 'Player') {
    //                value = new TeamPlayerValue(this.value, true);
    //            } else {
    //                value = new TeamPlayerValue(this.value, false);
    //            }
    //            break;
    //        case 'PLAYER_DROPDOWN':
    //            value = new TeamPlayerValue(this.value, true);
    //            break;
    //        case 'TEAM_DROPDOWN':
    //            value = new TeamPlayerValue(this.value, false);
    //            break;
    //        default:
    //            value = this.value;
    //            break;
    //    }
    //    return value;
    //}

    toJSON () {

        return '';
    }
}

/**
 * @module Field
 * @exports entities/field
 */
export default Field;
