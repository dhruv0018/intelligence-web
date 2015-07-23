import Field from './Field.js';

/* Fetch angular from the browser scope */
const angular = window.angular;

class YardField extends Field {
    constructor(field) {
        if (!field) return;
        super(field);

        this.initialize();

        this.availableValues = [];

        this.availableValues = Array.from(new Array(99), (item, yardLength) => {
            return {content: yardLength + 1, name: yardLength + 1};
        });

    }

    /**
     * Sets the value property by creating an 'available value'. If called from
     * the constructor, it uses default value if none are passed in.
     *
     * @method initialize
     * @param {string} [value] - the value to be set
     * @returns {undefined}
     */
    initialize (value = this.value) {

        let yard = {

            content: !this.isRequired ? null       : undefined,
            name   : !this.isRequired ? 'Optional' : 'Select'
        };

        if (value) {

            yard.content = Number(value);
            yard.name    = value;
        }

        this.currentValue = yard;
    }

    get currentValue () {

        return this.value;
    }

    set currentValue(yard) {
        let value = {};
        value.name = yard.name;
        value.content = yard.content;
        this.value = value;
    }

    /**
     * Generates an HTML string of the field.
     *
     * @method toString
     * @returns {String} - HTML of the field
     */
    toString () {

        return `<span class="value">${this.currentValue.content}</span>`;
    }

    /**
     * Reverts the class instance to JSON suitable for the server.
     *
     * @method toJSON
     * @returns {String} - JSON ready version of the object.
     */
    toJSON () {

        let variableValue = {};
        let value = (!this.isRequired && this.value.content === null) ? null : String(this.value.content);

        variableValue = {

            type: null,
            value
        };

        return this.isValid(variableValue) ? variableValue : 'Corrupted ' + this.inputType;
    }
}

export default YardField;
