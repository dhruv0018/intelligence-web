import Field from './field.js';

/* Fetch angular from the browser scope */
const angular = window.angular;

class TextField extends Field {
    constructor(field) {

        if (!field) return;
        super(field);

        let injector = angular.element(document).injector();

        let value = {};

        value.gapId = this.value;

        this.value = value;

        this.availableOptions = [];
    }
}

export default TextField;
