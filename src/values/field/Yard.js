import Field from './Field.js';

/* Fetch angular from the browser scope */
const angular = window.angular;

class YardField extends Field {
    constructor(field) {
        if (!field) return;
        super(field);

        let injector = angular.element(document).injector();
        let value = {};

        value.content = this.value;

        this.value = value;

        this.availableOptions = [];

        for (let yard = 1; yard < 100; yard++) {
            this.availableOptions.push(yard);
        }
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

export default YardField;
