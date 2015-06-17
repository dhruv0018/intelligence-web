import Field from './Field.js';

/* Fetch angular from the browser scope */
const angular = window.angular;

class GapField extends Field {
    constructor(field) {

        if (!field) return;
        super(field);

        let injector = angular.element(document).injector();
        const GAPS = injector.get('GAPS');

        let value = {
            gapId: !field.isRequired ? 'Optional' : undefined
        };

        if (field.value) {
            value.gapId = field.value;
        }

        this.value = value;
        this.availableValues = Object.keys(GAPS).map(key => GAPS[key]);
    }

    toJSON(){
        let variableValue = {};
        variableValue = {
            type: null,
            value: this.value.gapId
        };
        return this.isValid(variableValue) ? JSON.stringify(variableValue) : 'Corrupted ' + this.inputType;
    }
}

export default GapField;
