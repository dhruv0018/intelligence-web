import Field from './Field.js';

/* Fetch angular from the browser scope */
const angular = window.angular;

class GapField extends Field {
    constructor(field) {

        if (!field) return;
        super(field);

        let injector = angular.element(document).injector();

        let value = {
            gapId: !field.isRequired ? 'Optional' : null
        };

        if (field.value) {
            value.gapId = this.value;
        }

        this.value = value;

        this.availableOptions = injector.get('GAPS');
    }

    toJSON(){
        let variableValue = {};
        variableValue = {
            type: null,
            value: this.value.gapId
        };
        return JSON.stringify(variableValue);
    }
}

export default GapField;
