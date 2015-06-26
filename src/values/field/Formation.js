import Field from './Field.js';

/* Fetch angular from the browser scope */
const angular = window.angular;

class FormationField extends Field {
    constructor(field) {

        if (!field) return;
        super(field);

        let formation = {
            formationId: !field.isRequired ? null : undefined,
            numberOfPlayers: 0
        };

        if (field.value) {
            let currentFormation = this.formations[field.value];
            formation.formationId = currentFormation.id;
            formation.numberOfPlayers =  currentFormation.numberPlayers;
            formation.name =  currentFormation.name;
        }

        this.currentValue = formation;
        this.availableValues = Object.keys(this.formations).map(key => {
            let currentFormation = this.formations[key];
            return {
                formationId: currentFormation.id,
                numberOfPlayers: currentFormation.numberPlayers,
                name: currentFormation.name
            };
        });
    }

    get currentValue() {
        return this.value;
    }

    set currentValue(formation) {
        let value = {};
        value = formation;
        this.value = value;
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
