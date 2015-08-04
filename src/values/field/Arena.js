import Field from './Field';

/* Fetch angular from the browser scope */
const angular = window.angular;

/**
 * ArenaField Field Model
 * @class ArenaField
 */
class ArenaField extends Field {

    /**
     * @constructs ArenaField
     * @param {Object} field - Field JSON from server
     */
    constructor (field) {
        if (!field) return;
        super(field);

        let region = field.value && field.value.region ? this.initializeValue(field.value.region) : this.initializeValue(field.value);
        let coordinates = {
            x: field.value && field.value.coordinates && field.value.coordinates.x ? this.initializeValue(field.value.coordinates.x) : null,
            y: field.value && field.value.coordinates && field.value.coordinates.y ?  this.initializeValue(field.value.coordinates.y) : null
        };

        let value = {
            region,
            coordinates,
            get name() {
                let calculatedName = !this.isRequired ? 'Optional' : this.name;
                if (region) {
                    let injector = angular.element(document).injector();
                    this.regionMap = injector.get('ARENA_REGIONS_BY_ID');
                    calculatedName = angular.copy(this.regionMap[this.region].name);
                }
                return calculatedName;
            }
        };

        this.value = value;
    }

    /**
     * Getter for the validity of the Field
     * @type {Boolean}
     */
    get valid () {

        return this.isRequired ?
            (Number.isInteger(this.value.region) &&
            !isNaN(this.value.coordinates.x) &&
            !isNaN(this.value.coordinates.y)) :
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

        variableValue = {

            type: null,
            value: {
                coordinates: this.value.coordinates,
                region: this.value.region
            }
        };

        return this.isVariableValueValid(variableValue) ? variableValue : 'Corrupted ' + this.type;
    }
}

export default ArenaField;
