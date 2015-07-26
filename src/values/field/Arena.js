import Field from './Field.js';
/* Fetch angular from the browser scope */
const angular = window.angular;

class ArenaField extends Field {
    constructor(field) {
        if (!field) return;
        super(field);

        //todo look into initialization of arena value
        let arena = {
            region: !field.isRequired ? null : undefined,
            coordinates: {
                x: !field.isRequired ? null: undefined,
                y: !field.isRequired ? null: undefined
            }
        };

        if (field.value) {
            arena.coordinates = field.value.coordinates;
            arena.region = field.value.region;
        }

        this.currentValue = arena;
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

    get currentValue() {
        return this.value;
    }

    set currentValue(arena) {
        let value = {};
        value.coordinates = arena.coordinates;
        value.region = arena.region && arena.region.id ? arena.region.id : arena.region;
        this.value = value;
    }

    get valid () {

        return this.isRequired ?
            (Number.isInteger(this.value.region) &&
            isNan(this.value.coordinates.x) &&
            isNan(this.value.coordinates.y)) :
            true;
    }

    toJSON() {
        let variableValue = {};
        variableValue = {
            type: null,
            value: {
                coordinates: this.value.coordinates,
                region: this.value.region
            }
        };
        return this.isValid(variableValue) ? JSON.stringify(variableValue) : 'Corrupted ' + this.inputType;
    }
}

export default ArenaField;
