import Field from './Field.js';

/* Fetch angular from the browser scope */
const angular = window.angular;

class YardField extends Field {
    constructor(field) {
        if (!field) return;
        super(field);

        let yard = {
            content: !field.isRequired ? 'Optional' : undefined
        };

        if (field.value) yard.content = field.value;

        this.currentValue = yard;

        this.availableValues = [];

        // for (let yard = 1; yard < 100; yard++) {
        //     this.availableValues.push({content: yard});
        // }
        this.availableValues = Array.from(new Array(99), (item, yardLength) => {
            return {content: yardLength + 1};
        });
    }

    get currentValue() {
        return this.value;
    }

    set currentValue(yard) {
        let value = {};
        value.content = yard.content;
        this.value = value;
    }

    toJSON() {
        let variableValue = {};
        variableValue = {
            type: null,
            value: this.value.content
        };

        return this.isValid(variableValue) ? JSON.stringify(variableValue) : 'Corrupted ' + this.inputType;
    }
}

export default YardField;
