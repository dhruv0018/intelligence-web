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
                let calculatedName = !this.isRequired ? 'Optional' : this.name;
                if (this.region) {
                    let injector = angular.element(document).injector();
                    this.regionMap = injector.get('ARENA_REGIONS_BY_ID');
                    calculatedName = angular.copy(this.regionMap[this.region].name);
                }
                return calculatedName;
            }
        });
        this.availableValues = null;
    }

    //TODO temporary a NEED
    arenaName(region = this.value.region){
        let calculatedName = !this.isRequired ? 'Optional' : this.name;
        if (region) {
            let injector = angular.element(document).injector();
            this.regionMap = injector.get('ARENA_REGIONS_BY_ID');
            calculatedName = angular.copy(this.regionMap[region].name);
        }
        return calculatedName;
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
            },
            name: this.name
        };

        if (value && value.coordinates) {
            arena.coordinates = value.coordinates;
            arena.region = value.region;
            arena.name = this.arenaName(arena.region) || this.name;
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
        let name = this.arenaName();
        return `<span class="value gap-field">${name}</span>`;
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
