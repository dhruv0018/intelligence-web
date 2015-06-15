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
        //todo might not want this
        value.regionId = (this.value && this.value.region) ? this.value.region.id : undefined;

        this.value = value;

        this.availableOptions = null;
    }
}

export default ArenaField;
