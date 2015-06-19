import Field from './Field.js';
/* Fetch angular from the browser scope */
const angular = window.angular;

class ArenaField extends Field {
    constructor(field) {
        if (!field) return;
        super(field);

        let injector = angular.element(document).injector();
        this.regionMap = injector.get('ARENA_REGIONS_BY_ID');

        //todo look into initialization of arena value
        let arena = {
            regionId: !field.isRequired ? null : undefined,
            coordinates: !field.isRequired ? {} : {},
            name: !field.isRequired ? 'Optional' : undefined
        };

        if (field.value && field.value.region && field.value.region.id) {
            arena.coordinates = this.value.coordinates;
            arena.regionId = this.value.region.id;
            arena.name = this.regionMap[arena.regionId].name;
        }

        this.currentValue = arena;

        this.availableValues = null;
    }

    get currentValue() {
        return this.value;
    }

    set currentValue(arena) {
        let value = {};
        value.coordinates = arena.coordinates;
        value.regionId = arena.region.id;
        value.name = this.regionMap[arena.region.id].name;
        this.value = value;
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
        return this.isValid(variableValue) ? JSON.stringify(variableValue) : 'Corrupted ' + this.inputType;
    }
}

export default ArenaField;
