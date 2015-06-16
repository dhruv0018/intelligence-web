import Field from './Field.js';

/* Fetch angular from the browser scope */
const angular = window.angular;

class TextField extends Field {
    constructor(field) {
        if (!field) return;
        super(field);

        let injector = angular.element(document).injector();

        let value = {
            content: !field.isRequired? 'Optional' : null
        };

        if (field.value) {
            value.content = this.value;
        }

        this.value = value;

        this.availableOptions = null;
    }

    toJSON() {
        let variableValue = {};
        variableValue = {
            type: null,
            value: this.value.content
        };
        return JSON.stringify(variableValue);
    }
}

export default TextField;
