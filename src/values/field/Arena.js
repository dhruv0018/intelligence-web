import Field from './Field.js';
/* Fetch angular from the browser scope */
const angular = window.angular;

class ArenaField extends Field {
    constructor(field) {
        if (!field) return;
        super(field);

        let injector = angular.element(document).injector();
        let value = {};

        value.coordinates = this.value.coordinates;
        value.regionId = this.value.region.id;

        this.value = value;

        this.availableOptions = null;
    }
}

export default ArenaField;
