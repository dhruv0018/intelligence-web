import Field from './Field';
import PassingZoneConstants from '../../constants/football/zones';

/* Fetch angular from the browser scope */
const angular = window.angular;

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

        this.ZONES = PassingZoneConstants.ZONES;
        this.ZONE_IDS = PassingZoneConstants.ZONE_IDS;
        this.availableValues = Object.keys(this.ZONES).map(key => {
            let currentZone = angular.copy(this.ZONES[key]);
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

        this.initialize();
    }

    /**
     * Sets the value property by creating an 'available value'. If called from
     * the constructor, it uses default value if none are passed in.
     *
     * @method initialize
     * @param {object} [value] - the value to be set
     * @returns {undefined}
     */
    initialize (value = this.value) {

        let zone = angular.copy(this.availableValues[0]);

        if (value) {

            let currentZone = angular.copy(this.ZONES[this.ZONE_IDS[value]]);

            zone = {

                zoneId          : Number(currentZone.value),
                name            : currentZone.name,
                keyboardShortcut: currentZone.shortcut
            };
        }

        this.currentValue = zone;
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
     * Reverts the class instance to JSON suitable for the server.
     *
     * @method toJSON
     * @returns {String} - JSON ready version of the object.
     */
    toJSON () {

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
