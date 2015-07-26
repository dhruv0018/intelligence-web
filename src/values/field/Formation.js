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

    get valid () {

        return this.isRequired ?
            (Number.isInteger(this.value.formationId) &&
            Number.isInteger(this.value.numberOfPlayers)) :
            true;
    }

    toJSON() {
        let variableValue = {};
        let value = this.value.formationId === null ? null : String(this.value.formationId);
        variableValue = {
            type: null,
            value
        };
        return this.isValid(variableValue) ? JSON.stringify(variableValue) : 'Corrupted ' + this.inputType;

    }
}

export default FormationField;
