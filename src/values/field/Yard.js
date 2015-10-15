import Field from './Field';

/* Fetch angular from the browser scope */
const angular = window.angular;

/**
 * YardField Field Model
 * @class YardField
 */
class YardField extends Field {

    /**
     * @constructs YardField
     * @param {Object} field - Field JSON from server
     */
    constructor (field) {
        super(field);
        let content = this.initializeValue(field.value);
        this.value = {
            content,
            name: content ? String(content) : field.name
        };
    }

    get availableValues() {
        let values = Array.from(new Array(101), (item, yardLength) => {
            //TODO rename yardLength to yard and use pad left
            let yard = yardLength < 10 ? '0' + String(yardLength) : String(yardLength);
            return {
                content: yardLength,
                name: yard,
                get order() {
                    return yardLength;
                }
            };
        });
        if (!this.isRequired) {
            values.unshift({content: null, name: this.name, order: 0});
        }
        return values;
    }

    /**
     * Getter for the validity of the Field
     * @type {Boolean}
     */
    get valid () {

        return this.isRequired ?
            Number.isInteger(this.value.content) :
            true;
    }

    /**
     * Generates an HTML string of the field.
     *
     * @method toString
     * @param {Boolean} format
     * @returns {String} HTML of the field
     */
    toString (format) {

        const value = format ? this.formatValueName(this.value.name) : this.value.name;
        return `<span class="value">${value}</span>`;
    }

    /**
     * Helper method to format yard field value to 0-50 range
     * @method formatValueName
     * @param {String | Integer} name
     * @returns {Integer} formattedName
     */
    formatValueName(name) {

        const maxYards = 100; // FIXME: Should use config
        const yards = parseInt(name);
        return (yards > maxYards/2) ? (maxYards - yards) : yards;
    }

    /**
     * Reverts the class instance to JSON suitable for the server.
     *
     * @method toJSON
     * @returns {String} - JSON ready version of the object.
     */
    toJSON () {

        let variableValue = {};
        let value         = (!this.isRequired && this.value.content === null) ? null : String(this.value.content);

        variableValue = {

            type: null,
            value
        };

        return this.isVariableValueValid(variableValue) ? variableValue : 'Corrupted ' + this.type;
    }
}

export default YardField;
