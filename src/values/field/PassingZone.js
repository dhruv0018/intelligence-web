import Field from './Field';
import PassingZoneConstants from '../../constants/football/zones';

/* Fetch angular from the browser scope */
const angular = window.angular;
const ZONES = PassingZoneConstants.ZONES;
const ZONE_IDS = PassingZoneConstants.ZONE_IDS;

/**
 * PassingZoneField Field Model
 * @class PassingZoneField
 */
class PassingZoneField extends Field {

    /**
     * @constructs PassingZoneField
     * @param {Object} field - Field JSON from server
     */
    constructor (field) {

        if (!field) return;
        super(field);
        let zoneId = this.initializeValue(field.value);
        let zone = angular.copy(ZONES[ZONE_IDS[zoneId]]);
        let value = {
            zoneId,
            get name() {
                let calculatedName = !field.isRequired ? 'Optional' : this.name;
                if (zone) {
                    calculatedName = zone.name;
                }
                return calculatedName;
            },
            keyboardShortcut: zone ? zone.shortcut : undefined
        };
        this.value = value;
    }

    get availableValues() {
        let values = Object.keys(ZONES).map(key => {
            let currentZone = angular.copy(ZONES[key]);
            let value = {
                zoneId: Number(currentZone.value),
                name: currentZone.name,
                keyboardShortcut: currentZone.shortcut
            };
            return value;
        });
        values.unshift({zoneId: null, name: 'Optional'});
        return values;
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

    /**
     * Getter for the validity of the Field
     * @type {Boolean}
     */
    get valid () {

        return this.isRequired ?
            Number.isInteger(this.value.zoneId) :
            true;
    }

    /**
     * Reverts the class instance to JSON suitable for the server.
     *
     * @method toJSON
     * @returns {String} - JSON ready version of the object.
     */
    toJSON () {

        let variableValue = {};
        let value         = this.value.zoneId === null ? null : String(this.value.zoneId);

        variableValue = {

            type: null,
            value
        };

        return this.isVariableValueValid(variableValue) ? variableValue : 'Corrupted ' + this.type;
    }
}

export default PassingZoneField;
