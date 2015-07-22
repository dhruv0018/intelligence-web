import Field from './Field.js';
import PassingZoneConstants from '../../constants/football/zones.js';
/* Fetch angular from the browser scope */
const angular = window.angular;

class PassingZoneField extends Field {
    constructor(field) {

        if (!field) return;
        super(field);

        const ZONES = PassingZoneConstants.ZONES;
        const ZONE_IDS = PassingZoneConstants.ZONE_IDS;
        this.availableValues = Object.keys(ZONES).map(key => {
            let currentZone = angular.copy(ZONES[key]);
            let value = {
                gapId: Number(currentZone.value),
                name: currentZone.name,
                keyboardShortcut: currentZone.shortcut
            };
            return value;
        });
        let initialZone = {
            name: !field.isRequired ? 'Optional' : 'Select',
            zoneId: !field.isRequired ? null : undefined,
            keyboardShortcut: undefined
        };
        this.availableValues.unshift(initialZone);

        let zone = angular.copy(this.availableValues[0]);
        if (field.value) {
            let currentZone = angular.copy(ZONES[ZONE_IDS[field.value]]);
            zone = {
                zoneId: Number(currentZone.value),
                name: currentZone.name,
                keyboardShortcut: currentZone.shortcut
            };
        }

        this.currentValue = zone;
    }

    get currentValue() {
        return this.value;
    }

    set currentValue(zone) {
        this.value = zone;
    }

    /**
     * Generates an HTML string of the field.
     *
     * @method toString
     * @returns {String} - HTML of the field
     */
    toString () {

        return `<span class="value passing-zone-field">${this.currentValue.name}</span>`;
    }

    toJSON(){
        let variableValue = {};
        let value = this.value.zoneId === null ? null : String(this.value.zoneId);
        variableValue = {
            type: null,
            value
        };

        return this.isValid(variableValue) ? variableValue : 'Corrupted ' + this.inputType;
    }
}

export default PassingZoneField;
