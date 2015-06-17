import Field from './Field.js';

/* Fetch angular from the browser scope */
const angular = window.angular;

class FormationField extends Field {
    constructor(field) {

        if (!field) return;
        super(field);

        let injector = angular.element(document).injector();

        let value = {
            formationId: !field.isRequired ? null : undefined,
            numberOfPlayers: 0
        };

        if (field.value) {
            let formation = this.formations[field.value];
            value.formationId = formation.id;
            value.numberOfPlayers = formation.numberPlayers;
            value.name = formation.name;
        }

        this.value = value;
        this.availableValues = Object.keys(this.formations).map(key => this.formations[key]);
    }

    toJSON() {
        let variableValue = {};
        variableValue = {
            type: null,
            value: this.value.formationId
        };
        return this.isValid(variableValue) ? JSON.stringify(variableValue) : 'Corrupted ' + this.inputType;
    }
}

export default FormationField;
