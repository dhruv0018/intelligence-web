import Field from './Field.js';
/* Fetch angular from the browser scope */
const angular = window.angular;

class ArenaField extends Field {
    constructor(field) {
        if (!field) return;
        super(field);

        //todo look into initialization of arena value
        let arena = {
            regionId: !field.isRequired ? null : undefined,
            coordinates: !field.isRequired ? {} : {}
        };

        if (field.value && field.value.region && field.value.region.id) {
            arena.coordinates = field.value.coordinates;
            arena.regionId = field.value.region.id;
        }

        let injector = angular.element(document).injector();
        this.regionMap = injector.get('ARENA_REGIONS_BY_ID');

        this.currentValue = arena;
        Object.defineProperty(this.value, 'name', {
            get: () => {
                let calculatedName = !this.isRequired ? 'Optional' : 'Select';
                if (this.currentValue.regionId) {
                    calculatedName = angular.copy(this.regionMap[this.currentValue.regionId].name);
                }
                return calculatedName;
            }
        });
        Object.defineProperty(this.value, 'description', {
            get: () => {
                let calculatedDescription = !this.isRequired ? 'Optional' : 'Select';
                if (this.currentValue.regionId) {
                    calculatedDescription = angular.copy(this.regionMap[this.currentValue.regionId].description);
                }
                return calculatedDescription;
            }
        });
        this.availableValues = null;
    }

    get currentValue() {
        return this.value;
    }

    set currentValue(arena) {
        let value = {};
        value.coordinates = arena.coordinates;
        value.regionId = arena.regionId;
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

    toJSON() {
        let variableValue = {};
        variableValue = {
            type: null,
            value: {
                coordinates: this.value.coordinates,
                region: {
                    id: this.value.regionId
                }
            }
        };

        return this.isValid(variableValue) ? variableValue : 'Corrupted ' + this.inputType;
    }
}

export default ArenaField;
