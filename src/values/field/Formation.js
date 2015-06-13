import Field from './Field.js';

/* Fetch angular from the browser scope */
const angular = window.angular;

class FormationField extends Field {
    constructor(field) {

        if (!field) return;
        super(field);

        let injector = angular.element(document).injector();

        let value = {};

        value.formationId = this.value;
        value.numberPlayers = this.numberPlayers;

        this.value = value;

        //todo note the available values should be in at this point, lmk if they are not
    }
}

export default FormationField;
