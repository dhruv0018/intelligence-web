import Field from './Field.js';
/* Fetch angular from the browser scope */
const angular = window.angular;

class ArenaField extends Field {
    constructor(field) {
        if (!field) return;
        super(field);

        let injector = angular.element(document).injector();
        let value = {
            regionId: !field.isRequired ? undefined : null,
            coordinates: !field.isRequired ? undefined: {}
        };

        if (field.value && field.value.region && field.value.region.id) {
            value.coordinates = this.value.coordinates;
            value.regionId = this.value.region.id;
        }

        this.value = value;

        this.availableOptions = null;
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
