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


        this.initialize();

        Object.defineProperty(this.value, 'name', {
            get: () => {
                let calculatedName = !this.isRequired ? 'Optional' : 'Select';
                if (this.regionId) {
                    let injector = angular.element(document).injector();
                    this.regionMap = injector.get('ARENA_REGIONS_BY_ID');
                    calculatedName = angular.copy(this.regionMap[this.region].name);
                }
                return calculatedName;
            }
        });
        this.availableValues = null;
    }

    /**
     * Sets the value property by creating an 'available value'. If called from
     * the constructor, it uses default value if none are passed in.
     *
     * @method initialize
     * @param {integer} [value] - the value to be set
     * @returns {undefined}
     */
    initialize (value = this.value) {

        //todo look into initialization of arena value
        let arena = {
            region: !this.isRequired ? null : undefined,
            coordinates: {
                x: !this.isRequired ? null: undefined,
                y: !this.isRequired ? null: undefined
            }
        };

        if (value) {
            arena.coordinates = value.coordinates;
            arena.region = value.region;
        }

        this.currentValue = arena;
    }

    get currentValue () {

        return this.value;
    }

    set currentValue(arena) {
        let value = {};
        value.coordinates = arena.coordinates;
        value.region = arena.region && arena.region.id ? arena.region.id : arena.region;
        this.value = value;
    }


    /**
     * Generates an HTML string of the field.
     *
     * @method toString
     * @returns {String} - HTML of the field
     */
    toString () {

        return `<span class="value gap-field">${this.currentValue.description}</span>`;
    }

    /**
     * Reverts the class instance to JSON suitable for the server.
     *
     * @method toJSON
     * @returns {String} - JSON ready version of the object.
     */

    toJSON() {
        let variableValue = {};
        variableValue = {
            type: null,
            value: {
                coordinates: this.value.coordinates,
                region: this.value.region
            }
        };

        return this.isValid(variableValue) ? variableValue : 'Corrupted ' + this.type;
    }

    get valid () {

        return this.isRequired ?
            (Number.isInteger(this.value.region) &&
            isNan(this.value.coordinates.x) &&
            isNan(this.value.coordinates.y)) :
            true;
    }
}

export default ArenaField;
