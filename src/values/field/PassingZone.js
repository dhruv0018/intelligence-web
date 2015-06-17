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

        let zone = {
            name: !field.isRequired ? 'Optional' : undefined,
            zoneId: !field.isRequired ? null : undefined,
            keyboardShortcut: null
        };

        if (field.value) zone = this.ZONES[this.ZONE_IDS[field.value]];

        this.currentValue = zone;

        this.availableValues = Object.keys(this.ZONES).map(key => this.ZONES[key]);
    }

    get currentValue() {
        return this.value;
    }

    set currentValue(zone) {
        let value = {};
        value.zoneId = zone.value;
        value.keyboardShortcut = zone.shortcut;
        value.name = zone.name;
        this.value = value;
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
