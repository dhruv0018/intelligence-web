import Field from './Field.js';

/* Fetch angular from the browser scope */
const angular = window.angular;

class FormationField extends Field {
    constructor(field) {

        if (!field) return;
        super(field);

        let injector = angular.element(document).injector();

        let value = {
            formationId: !field.isRequired ? undefined : null,
            numberPlayers: 0
        };

        if (field.value) {
            value.formationId = field.value;
            value.numberPlayers = field.numberPlayers;
        }

        this.value = value;

        //todo note the available values should be in at this point, lmk if they are not
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
