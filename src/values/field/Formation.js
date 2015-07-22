import Field from './Field.js';

/* Fetch angular from the browser scope */
const angular = window.angular;

class FormationField extends Field {
    constructor(field) {

        if (!field) return;
        super(field);

        let initialFormation = {
            formationId: !field.isRequired ? null : undefined,
            numberOfPlayers: 0,
            name: !field.isRequired ? 'Optional' : 'Select'
        };
        let keyedFormations = {};
        this.formations.forEach(formation => keyedFormations[formation.id] = formation);

        this.availableValues = [];
        this.availableValues = this.formations.map(formation => {
            let currentFormation = angular.copy(formation);
            return {
                formationId: currentFormation.id,
                numberOfPlayers: currentFormation.numberPlayers,
                name: currentFormation.name
            };
        });
        this.availableValues.unshift(initialFormation);

        let formation = angular.copy(this.availableValues[0]);

        if (field.value) {
            let currentFormation = angular.copy(keyedFormations[field.value]);
            let value = {
                formationId: currentFormation.id,
                numberOfPlayers: currentFormation.numberPlayers,
                name: currentFormation.name
            };
            formation = value;
        }

        this.currentValue = formation;

    }

    get currentValue() {
        return this.value;
    }

    set currentValue(formation) {
        let value = {};
        value = formation;
        this.value = value;
    }

    /**
     * Generates an HTML string of the field.
     *
     * @method toString
     * @returns {String} - HTML of the field
     */
    toString () {

        return `<span class="value formation-field">${this.currentValue.name}</span>`;
    }

    /**
     * Reverts the class instance to JSON suitable for the server.
     *
     * @method toJSON
     * @returns {String} - JSON ready version of the object.
     */
    toJSON () {

        let variableValue = {};
        let value = this.value.formationId === null ? null : String(this.value.formationId);
        variableValue = {
            type: null,
            value
        };

        return this.isValid(variableValue) ? variableValue : 'Corrupted ' + this.inputType;
    }
}

export default FormationField;
