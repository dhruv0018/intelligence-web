import Field from './Field.js';

/* Fetch angular from the browser scope */
const angular = window.angular;

class PassingZoneField extends Field {
    constructor(field) {

        if (!field) return;
        super(field);

        let injector = angular.element(document).injector();
        this.ZONES = injector.get('ZONES');
        this.ZONE_IDS = injector.get('ZONE_IDS');

        let value = {
            zoneId: !field.isRequired ? 'Optional' : undefined
        };

        if (field.value) {
            let zone = this.ZONES[this.ZONE_IDS[field.value]];
            value.zoneId = zone.value;
            value.keyboardShortcut = zone.shortcut;
            value.name = zone.name;
        }

        this.value = value;

        this.availableValues = Object.keys(this.ZONES).map(key => this.ZONES[key]);
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
