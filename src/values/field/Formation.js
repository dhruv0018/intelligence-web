import Field from './Field';

/* Fetch angular from the browser scope */
const angular = window.angular;

/**
 * FormationField Field Model
 * @class FormationField
 */
class FormationField extends Field {

    /**
     * @constructs FormationField
     * @param {Object} field - Field JSON from server
     */
    constructor (field) {
        super(field);

        let formationId = this.initializeValue(field.value);
        let formation = this.formations.find(formation => formation.id === formationId);

        let value = {
            formationId,
            get name() {
                return formationId ? formation.name : field.name;
            },
            get numberOfPlayers(){
                return formation.numberPlayers;
            }
        };

        this.value = value;
    }

    get availableValues() {
        let values = [];
        values = this.formations.map(formation => {
            return {
                formationId: Number(formation.id),
                numberOfPlayers: formation.numberPlayers,
                name: formation.name,
                get order() {
                    //low priority formation is sent to the bottom
                    if (formation.name === 'Other') return 100;
                    return formation.numberPlayers;
                }
            };
        });
        if (!this.isRequired) {
            values.unshift({name: this.name, formationId: null, numberOfPlayers: 0});
        }
        return values;
    }

    /**
     * Getter for the validity of the Field
     * @type {Boolean}
     */
    get valid () {

        return this.isRequired ?
            Number.isInteger(this.value.formationId) :
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
            type: null
        };
        variableValue.value = this.value.formationId === null ? null : String(this.value.formationId);

        return this.isVariableValueValid(variableValue) ? variableValue : 'Corrupted ' + this.type;
    }
}

export default FormationField;
