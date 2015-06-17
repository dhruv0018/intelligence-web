import Field from './Field.js';

/* Fetch angular from the browser scope */
const angular = window.angular;

class PassingZoneField extends Field {
    constructor(field) {

        if (!field) return;
        super(field);

        let injector = angular.element(document).injector();

        let value = {
            zoneId: !field.isRequired ? 'Optional' : null
        };

        if (field.value) {
            value.zoneId = field.value;
        }

        this.value = value;

        this.availableValues = injector.get('ZONES');
    }

    toJSON(){
        let variableValue = {};
        variableValue = {
            type: null,
            value: this.value.zoneId
        };
        return this.isValid(variableValue) ? JSON.stringify(variableValue) : 'Corrupted ' + this.inputType;
    }
}

export default PassingZoneField;
