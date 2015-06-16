import Field from './Field.js';

/* Fetch angular from the browser scope */
const angular = window.angular;

class PassingZoneField extends Field {
    constructor(field) {

        if (!field) return;
        super(field);

        let injector = angular.element(document).injector();

        let value = {};

        value.zoneId = this.value;

        this.value = value;

        this.availableOptions = injector.get('ZONES');
    }

    toJSON(){
        let variableValue = {};
        variableValue = {
            type: null,
            value: this.value.zoneId
        };
        return JSON.stringify(variableValue);
    }
}

export default PassingZoneField;
