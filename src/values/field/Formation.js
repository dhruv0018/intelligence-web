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

        if (!field) return;
        super(field);

        let formationId = this.initializeValue(field.value);
        let formation = {};

        this.formations.forEach((currentFormation)=> {
            if (currentFormation.id === formationId) {
                formation = currentFormation;
            }
        });

        let value = {
            formationId,
            get name() {
                let calculatedName = field.name;
                if (formationId) {
                    calculatedName = formation.name;
                }
                return calculatedName;
            },
            get numberPlayers(){
                return formation.numberPlayers;
            }
        };

        this.value = value;
    }

    get availableValues() {
        let values = [];
        if (this.formations) {
            values = this.formations.map(formation => {
                let currentFormation = angular.copy(formation);
                return {
                    formationId: Number(currentFormation.id),
                    numberOfPlayers: currentFormation.numberPlayers,
                    name: currentFormation.name,
                    get order() {
                        return currentFormation.numberPlayers;
                    }
                };
            });
        }
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

        let variableValue = {};
        let value         = this.value.formationId === null ? null : String(this.value.formationId);

        variableValue = {

            type: null,
            value
        };

        return this.isVariableValueValid(variableValue) ? variableValue : 'Corrupted ' + this.type;
    }
}

export default FormationField;
