import Field from './field.js';

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
}

export default PassingZoneField;
