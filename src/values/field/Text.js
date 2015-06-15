import Field from './Field.js';

/* Fetch angular from the browser scope */
const angular = window.angular;

class TextField extends Field {
    constructor(field) {
        if (!field) return;
        super(field);

        let injector = angular.element(document).injector();

        let value = {};

        value.content = this.value;

        this.value = value;

        this.availableOptions = null;
    }
}

export default TextField;
